import { Component, OnInit, resource, Resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environment';
import { AppointmentResponseDTO } from '../../interfaces/appointmentDTO';
import { FormulaDetailResponseDTO } from '../../interfaces/formulaDetailDTO';

@Component({
  selector: 'app-appointments-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments-user.html'
})
export class AppointmentsUser implements OnInit {

  currentUser: any = null;
  expandedAppointment: string | null = null;

  appointments: Resource<AppointmentResponseDTO[]> = resource({
    loader: () => {
      if (!this.currentUser?.cedula) {
        return Promise.resolve([]);
      }
      return fetch(`${environment.apiUrl}/users/${this.currentUser.cedula}/appointments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }).then(result => result.json());
    }
  });

  formulaDetails: Resource<FormulaDetailResponseDTO[]> = resource({
    loader: () => {
      if (!this.currentUser?.cedula) {
        return Promise.resolve([]);
      }
      return fetch(`${environment.apiUrl}/users/${this.currentUser.cedula}/formula-details`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }).then(result => result.json());
    }
  });

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
  }

  toggleDetails(appointmentId: string): void {
    this.expandedAppointment = this.expandedAppointment === appointmentId ? null : appointmentId;
  }

  getFormulaDetailsForAppointment(appointmentId: string): FormulaDetailResponseDTO[] {
    if (!this.formulaDetails.value()) {
      return [];
    }
    return this.formulaDetails.value()!.filter(detail => {
      return detail.appointmentId === appointmentId;
    });
  }

}
