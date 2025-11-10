import { Component, OnInit, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserResponseDTO, UserUpdateDTO } from '../../interfaces/userDTO';
import { AuthService } from '../../services/auth'; 
import { UsuarioService } from '../../services/usuario-service'; 
import { environment } from '../../../environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html'
})
export class Profile implements OnInit {

  currentUser: UserResponseDTO | null = null;

  userUpdateData: UserUpdateDTO = {
    name: '',
    email: '',
    password: '', 
    epsName: '', 
    cityName: '', 
    phones: [''],
  };

  isSubmitting = false;
  submissionMessage: { type: 'success' | 'error'; text: string } | null = null;
  isLoadingProfile = true; 

  cities = resource({
    loader: () => fetch(`${environment.apiUrl}/cities`).then(result => result.json())
  });

  epsList = resource({
    loader: () => fetch(`${environment.apiUrl}/eps`).then(result => result.json())
  });

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
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

    this.usuarioService.getUsuario(user.cedula).subscribe({
      next: (data) => {
        this.currentUser = data;

        this.userUpdateData = {
          name: data.name,
          email: data.email,
          password: '', 
          phones: data.phones.length > 0 ? [...data.phones] : [''], 
          epsName: data.epsName, 
          cityName: data.cityName, 
        };
        this.isLoadingProfile = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoadingProfile = false;
        const errorMsg =
          err.error?.message ||
          'No se pudo cargar tu perfil. Intenta recargar la página.';
        this.submissionMessage = { type: 'error', text: errorMsg };
      },
    });
  }

  actualizarPerfil(): void {
    if (this.isSubmitting || !this.currentUser) return;

    this.isSubmitting = true;
    this.submissionMessage = null;

    const payload: UserUpdateDTO = {
      ...this.userUpdateData,

      password:
        this.userUpdateData.password && this.userUpdateData.password.trim() !== ''
          ? this.userUpdateData.password
          : null!, 

      phones: this.userUpdateData.phones.filter((tel) => tel && tel.trim() !== ''),
    };

    this.usuarioService
      .actualizarUsuario(this.currentUser.cedula, payload)
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submissionMessage = {
            type: 'success',
            text: '¡Perfil actualizado con éxito!',
          };

          this.currentUser = response;
          this.userUpdateData.name = response.name;
          this.userUpdateData.email = response.email;
          this.userUpdateData.epsName = response.epsName;
          this.userUpdateData.cityName = response.cityName;
          this.userUpdateData.phones =
            response.phones.length > 0 ? [...response.phones] : [''];
          this.userUpdateData.password = '';

        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting = false;

          const errorMsg =
            err.error?.message ||
            'Hubo un error al actualizar. Verifica tus datos.';
          this.submissionMessage = { type: 'error', text: errorMsg };
        },
      });
  }

  agregarTelefono(): void {
    this.userUpdateData.phones.push('');
  }

  eliminarTelefono(index: number): void {
    if (this.userUpdateData.phones.length > 1) {
      this.userUpdateData.phones.splice(index, 1);
    }
  }
}