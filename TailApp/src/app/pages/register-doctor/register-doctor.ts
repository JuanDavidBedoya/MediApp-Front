import { Component, CUSTOM_ELEMENTS_SCHEMA, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environment';
import { HttpErrorResponse } from '@angular/common/http';
import { DoctorService } from '../../services/doctor-service';
import { DoctorRequestDTO } from '../../interfaces/doctorDTO';

@Component({
  selector: 'app-register-doctor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-doctor.html',
})
export class RegisterDoctor {
  showPassword = false;
  registerForm: FormGroup;

  isSubmitting = false;
  submissionMessage: { type: 'success' | 'error'; text: string } | null = null;

  specialties = resource({
    loader: () =>
      fetch(`${environment.apiUrl}/specialities`).then((result) =>
        result.json()
      ),
  });

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      specialityName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {

    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.submissionMessage = null;

    const doctorData: DoctorRequestDTO = this.registerForm.value;

    console.log('Enviando datos del doctor:', doctorData);

    this.doctorService.registrarDoctor(doctorData).subscribe({
      next: (response) => {
        console.log('Doctor registrado con éxito:', response);
        this.isSubmitting = false;
        this.submissionMessage = {
          type: 'success',
          text: '¡Doctor registrado con éxito! Redirigiendo...',
        };
        setTimeout(() => {
          this.router.navigate(['/home-doctor']);
        }, 2000);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al registrar el doctor:', err);
        this.isSubmitting = false;

        const errorMsg =
          err.error?.message ||
          'Hubo un error en el registro. Por favor, verifica tus datos.';
        
        this.submissionMessage = {
          type: 'error',
          text: errorMsg,
        };
      },
    });
  }
}