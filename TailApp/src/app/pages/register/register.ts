import { Component, CUSTOM_ELEMENTS_SCHEMA, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { register } from 'swiper/element/bundle';
import { environment } from '../../../environment';
import { UsuarioService } from '../../services/usuario-service';
import { UserRequestDTO } from '../../interfaces/userDTO';

register();

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Register {

  showPassword = false;

  telefonos: string[] = [''];

  formData = {
    cedula: '',
    name: '',
    email: '',
    password: '',
    epsName: '', 
    cityName: '', 
  };

  isSubmitting = false;
  submissionMessage: { type: 'success' | 'error', text: string } | null = null;

  cities = resource({
    loader: () => fetch(`${environment.apiUrl}/cities`).then(result => result.json())
  });

  epsList = resource({
    loader: () => fetch(`${environment.apiUrl}/eps`).then(result => result.json())
  });

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  agregarTelefono(): void {
    this.telefonos.push('');
  }

  eliminarTelefono(index: number): void {
    if (this.telefonos.length > 1) {
      this.telefonos.splice(index, 1);
    }
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }

  registrarUsuario(): void {
    if (this.isSubmitting) return; // Prevenir doble envío
    this.isSubmitting = true;
    this.submissionMessage = null;

    const validTelefonos = this.telefonos.filter(tel => tel && tel.trim() !== '');

    const nuevoUsuario: UserRequestDTO = {
      cedula: this.formData.cedula,
      name: this.formData.name,
      email: this.formData.email,
      password: this.formData.password,
      epsName: this.formData.epsName!,   
      cityName: this.formData.cityName!, 
      phones: validTelefonos
    };

    this.usuarioService.registrarUsuario(nuevoUsuario).subscribe({
      next: (response) => {
        console.log('Usuario registrado con éxito:', response);
        this.isSubmitting = false;

        this.submissionMessage = { type: 'success', text: '¡Registro exitoso! Redirigiendo al login...' };

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error al registrar el usuario:', err);
        this.isSubmitting = false;

        const errorMsg = err.error?.message || 'Hubo un error en el registro. Por favor, verifica tus datos.';
        this.submissionMessage = { type: 'error', text: errorMsg };
      }
    });
  }
}
