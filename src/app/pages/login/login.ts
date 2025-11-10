import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { AuthService } from '../../services/auth';
import { LoginDTO } from '../../interfaces/loginDTO';
import { AuthResponseDTO } from '../../interfaces/auth';

register();

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Login {

  formData: LoginDTO = {
    cedula: '',
    password: ''
  };

  errorMessage: string | null = null;
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  login(): void {

    this.errorMessage = null;
    this.isLoading = true;

    if (!this.formData.cedula || !this.formData.password) {
      this.errorMessage = 'Por favor, ingresa cédula y contraseña.';
      this.isLoading = false;
      return;
    }

    const request: LoginDTO = {
      cedula: this.formData.cedula,
      password: this.formData.password
    };

    console.log('📤 Enviando solicitud de login:', request);

    this.authService.login(request).subscribe({
    
      next: (response: AuthResponseDTO) => {
        this.isLoading = false;
        console.log('✅ Login exitoso. Respuesta recibida:', response);

        this.authService.saveSession(response);

        const role = response.role;
        console.log('Rol detectado:', role);

        if (role === 'USER') {
          this.router.navigate(['/home-private']); 
        } else if (role === 'DOCTOR') {
          this.router.navigate(['/home-doctor']); 
        } else {

          console.warn('Rol no reconocido, redirigiendo a home por defecto.');
          this.router.navigate(['/']);
        }
      },

      error: (err) => {
        this.isLoading = false;
        console.error('❌ Error en el login:', err);

        if (err.status === 400 || err.status === 401 || err.status === 403) {
          this.errorMessage = 'La cédula o la contraseña son incorrectas.';
        } else if (err.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor. Revisa tu conexión.';
        } else {
          this.errorMessage = 'La cédula o la contraseña son incorrectas.';
        }
      }
    });
  }
}
