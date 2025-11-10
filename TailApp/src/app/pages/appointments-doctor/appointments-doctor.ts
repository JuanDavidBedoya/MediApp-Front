import { Component, OnInit, resource, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AppointmentService, AppointmentFilter } from '../../services/appointment-service';
import { AuthService } from '../../services/auth';
import { AppointmentResponseDTO } from '../../interfaces/appointmentDTO';

@Component({
  selector: 'app-appointments-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments-doctor.html'
})
export class AppointmentsDoctor implements OnInit {
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  doctorCedula: string | null = null;
  errorMessage = signal<string | null>(null);

  filterType = signal<AppointmentFilter>('TODAY');
  customDate = signal<string>(this.getCurrentDateISO());

  getCurrentDateISO(): string {
    return new Date().toISOString().split('T')[0];
  }

  appointmentsResource = resource({
    params: () => ({ 
      cedula: this.doctorCedula, 
      filter: this.filterType(), 
      date: this.customDate() 
    }),
    loader: async ({ params }) => {
      try {
        const { cedula, filter, date } = params;
        if (!cedula) return [] as AppointmentResponseDTO[]; 

        let effectiveDate: string | undefined;
        if (filter === 'CUSTOM') {
          effectiveDate = date;
        }
        
        return await this.appointmentService.getDoctorAppointments(
          cedula,
          filter as AppointmentFilter,
          effectiveDate
        ).toPromise() as AppointmentResponseDTO[];
      } catch (error) {
        console.error('Error cargando citas:', error);
        this.errorMessage.set('Error al cargar las citas. Intenta de nuevo.');
        return [];
      }
    },
    defaultValue: [] as AppointmentResponseDTO[],
  });

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (user && user.cedula && this.authService.isDoctor()) {
      this.doctorCedula = user.cedula;
    } else {
      this.errorMessage.set('Acceso denegado. Debe iniciar sesión como Doctor.');
    }
  }

  onFilterChange(event: Event): void {
    const selectedFilter = (event.target as HTMLSelectElement).value as AppointmentFilter;
    this.filterType.set(selectedFilter);
    this.errorMessage.set(null);
  }

  onDateChange(event: Event): void {
    const date = (event.target as HTMLInputElement).value;
    this.customDate.set(date);
    this.errorMessage.set(null);
  }

  clearFilters(): void {
    this.filterType.set('TODAY');
    this.customDate.set(this.getCurrentDateISO());
    this.errorMessage.set(null);
  }

  goToCreateFormula(appointment: AppointmentResponseDTO): void {
    // Primero crear la fórmula básica
    const formulaRequest = {
      appointmentId: appointment.idAppointment,
      date: new Date().toISOString().split('T')[0]
    };

    // Llamar al servicio para crear la fórmula
    this.appointmentService.createFormula(formulaRequest).subscribe({
      next: (formulaResponse: any) => {
        console.log('Fórmula creada:', formulaResponse);
        // Redirigir a la página de fórmula con el ID de la fórmula creada
        this.router.navigate(['/create-formula'], {
          queryParams: {
            patientCedula: appointment.patientCedula,
            appointmentId: appointment.idAppointment,
            formulaId: formulaResponse.idFormula
          },
        });
      },
      error: (error) => {
        console.error('Error creando fórmula:', error);
        this.errorMessage.set('Error al crear la fórmula. Intente nuevamente.');
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
        // Crear fecha sin zona horaria para evitar problemas de conversión
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateString;
    }
  }
}