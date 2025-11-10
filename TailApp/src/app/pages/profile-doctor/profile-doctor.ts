import { Component, OnInit, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DoctorResponseDTO, DoctorUpdateDTO } from '../../interfaces/doctorDTO'; 
import { AuthService } from '../../services/auth'; 
import { DoctorService } from '../../services/doctor-service';
import { environment } from '../../../environment';

@Component({
  selector: 'app-profile-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-doctor.html'
})
export class ProfileDoctor implements OnInit {

  currentDoctor: DoctorResponseDTO | null = null;

  doctorUpdateData: DoctorUpdateDTO = {
    name: '',
    phone: '',
    email: '',
    specialityName: '',
    password: '',
  };

  isSubmitting = false;
  submissionMessage: { type: 'success' | 'error'; text: string } | null = null;
  isLoadingProfile = true;

  specialities = resource({
    loader: () => fetch(`${environment.apiUrl}/specialities`).then(result => result.json())
  });


  constructor(
    private authService: AuthService,
    private doctorService: DoctorService
  ) { }

  ngOnInit(): void {
    this.cargarPerfilDoctor();
  }

  cargarPerfilDoctor(): void {
    this.isLoadingProfile = true;
    this.submissionMessage = null;
    const user = this.authService.getUser(); 

    if (!user || !user.cedula) {
      this.submissionMessage = {
        type: 'error',
        text: 'No se pudo cargar tu perfil. Intenta iniciar sesión de nuevo.',
      };
      this.isLoadingProfile = false;
      return;
    }

    this.doctorService.getDoctor(user.cedula).subscribe({
      next: (data) => {
        this.currentDoctor = data;

        this.doctorUpdateData = {
          name: data.name,
          email: data.email,
          password: '', 
          phone: data.phone,
          specialityName: data.specialityName,
        };
        this.isLoadingProfile = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoadingProfile = false;
        const errorMsg =
          err.error?.message ||
          'No se pudo cargar tu perfil de doctor. Intenta recargar la página.';
        this.submissionMessage = { type: 'error', text: errorMsg };
      },
    });
  }

  actualizarPerfilDoctor(): void {
    if (this.isSubmitting || !this.currentDoctor) return;

    this.isSubmitting = true;
    this.submissionMessage = null;

    const payload: DoctorUpdateDTO = {
      ...this.doctorUpdateData,

    
      password:
        this.doctorUpdateData.password && this.doctorUpdateData.password.trim() !== ''
          ? this.doctorUpdateData.password
          : null!, 
    };

    this.doctorService
      .actualizarDoctor(this.currentDoctor.cedula, payload)
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submissionMessage = {
            type: 'success',
            text: '¡Perfil de Doctor actualizado con éxito!',
          };

          this.currentDoctor = response;
          this.doctorUpdateData.name = response.name;
          this.doctorUpdateData.email = response.email;
          this.doctorUpdateData.specialityName = response.specialityName;
          this.doctorUpdateData.phone = response.phone;
          this.doctorUpdateData.password = ''; 

        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          const errorMsg =
            err.error?.message ||
            'Hubo un error al actualizar el perfil del doctor. Verifica tus datos.';
          this.submissionMessage = { type: 'error', text: errorMsg };
        },
      });
  }
}