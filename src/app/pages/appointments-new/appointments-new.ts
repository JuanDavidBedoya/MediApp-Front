import { Component, OnInit, resource, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AppointmentService } from '../../services/appointment-service';
import { AuthService } from '../../services/auth';
import { AppointmentRequestDTO } from '../../interfaces/appointmentDTO';
import { SpecialityResponseDTO } from '../../interfaces/specialityDTO';
import { DoctorResponseDTO } from '../../interfaces/doctorDTO';

@Component({
    selector: 'app-appointments-new',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './appointments-new.html'
})
export class AppointmentsNew implements OnInit {

    private appointmentService = inject(AppointmentService);
    private authService = inject(AuthService);
    private router = inject(Router);

    selectedSpecialityName = signal<string | undefined>(undefined);
    selectedDate = signal<string | undefined>(undefined);
    selectedTime = signal<string | undefined>(undefined);

    appointmentData: Partial<AppointmentRequestDTO> = {
        patientCedula: '',
        observations: '',
    };

    isSubmitting = false;
    submissionMessage: { type: 'success' | 'error'; text: string } | null = null;
    isLoadingInitial = true;

    minDate: string = new Date().toISOString().split('T')[0];

    specialitiesResource = resource({
        loader: async () => {
            try {
                return await this.appointmentService.getSpecialities().toPromise() as SpecialityResponseDTO[];
            } catch (error) {
                console.error('Error cargando especialidades:', error);
                this.submissionMessage = { type: 'error', text: 'Error al cargar especialidades médicas.' };
                return [];
            }
        },
        defaultValue: [] as SpecialityResponseDTO[]
    });

    availableTimeSlots = [
        '08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00',
        '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00'
    ];


    ngOnInit(): void {
        const user = this.authService.getUser();
        if (user && user.cedula) {
            this.appointmentData.patientCedula = user.cedula;
            this.isLoadingInitial = false;
        } else {
            this.submissionMessage = { type: 'error', text: 'No se pudo identificar al usuario. Inicia sesión.' };
            this.isLoadingInitial = false;
            setTimeout(() => this.router.navigate(['/login']), 2000);
        }
    }

    onSpecialityChange(event: Event): void {
        const specialityName = (event.target as HTMLSelectElement).value;
        this.selectedSpecialityName.set(specialityName);
        this.selectedDate.set(undefined);
        this.selectedTime.set(undefined);
    }

    onDateChange(event: Event): void {
        const date = (event.target as HTMLInputElement).value;
        this.selectedDate.set(date);
        this.selectedTime.set(undefined);
    }

    onTimeChange(event: Event): void {
        this.selectedTime.set((event.target as HTMLSelectElement).value);
    }

    scheduleAppointment(): void {
        if (this.isSubmitting || !this.selectedSpecialityName() || !this.selectedDate() || !this.selectedTime()) {
            this.submissionMessage = { type: 'error', text: 'Por favor, completa los campos de Especialidad, Fecha y Hora.' };
            return;
        }

        this.isSubmitting = true;
        this.submissionMessage = null;

        // First, get a doctor for the selected speciality
        this.appointmentService.getDoctorsBySpeciality(this.selectedSpecialityName()!).subscribe({
            next: (doctors) => {
                if (doctors && doctors.length > 0) {
                    const doctorCedula = doctors[0].cedula; // Take the first available doctor

                    const payload: AppointmentRequestDTO = {
                        doctorCedula: doctorCedula,
                        patientCedula: this.appointmentData.patientCedula!,
                        date: this.selectedDate()!,
                        time: this.selectedTime()!,
                        observations: this.appointmentData.observations || '',
                    };

                    this.appointmentService.scheduleAppointment(payload).subscribe({
                        next: (response) => {
                            this.isSubmitting = false;

                            this.submissionMessage = {
                                type: 'success',
                                text: `¡Cita agendada con éxito el ${response.date} a las ${response.time}! Redirigiendo...`,
                            };
                            setTimeout(() => this.router.navigate(['/appointments-user']), 3000);
                        },
                        error: (err: HttpErrorResponse) => {
                            this.isSubmitting = false;
                            const errorMsg =
                                err.error?.message ||
                                'Hubo un error al agendar la cita. Verifica que haya disponibilidad.';
                            this.submissionMessage = { type: 'error', text: errorMsg };
                        },
                    });
                } else {
                    this.isSubmitting = false;
                    this.submissionMessage = { type: 'error', text: 'No hay doctores disponibles para esta especialidad.' };
                }
            },
            error: (err) => {
                this.isSubmitting = false;
                this.submissionMessage = { type: 'error', text: 'Error al obtener doctores disponibles.' };
            }
        });
    }
}