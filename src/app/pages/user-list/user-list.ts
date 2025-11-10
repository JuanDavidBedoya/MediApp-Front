import { Component, CUSTOM_ELEMENTS_SCHEMA, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environment';
import { UsuarioService } from '../../services/usuario-service';
import { UserResponseDTO } from '../../interfaces/userDTO';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-list.html',
})
export class UserList {

  allUsers: UserResponseDTO[] = [];
  usuariosFiltrados: UserResponseDTO[] = [];
  usuariosPaginados: UserResponseDTO[] = [];

  filtroEps: string = '';
  filtroCiudad: string = '';

  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  Math = Math; 

  isLoading: boolean = true;

  cities = resource({
    loader: () => fetch(`${environment.apiUrl}/cities`).then(result => result.json())
  });

  epsList = resource({
    loader: () => fetch(`${environment.apiUrl}/eps`).then(result => result.json())
  });

  // Array de páginas para la paginación
  paginasArray: number[] = [];

  constructor(
    private usuarioService: UsuarioService
  ) {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.getAllUsers().subscribe({
      next: (usuarios) => {
        console.log('Usuarios cargados:', usuarios);
        this.allUsers = usuarios;
        this.aplicarFiltros();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.isLoading = false;
        this.allUsers = [];
        this.usuariosFiltrados = [];
        this.usuariosPaginados = [];
      }
    });
  }

  aplicarFiltros(): void {
    let usuariosFiltrados = [...this.allUsers];

    if (this.filtroEps) {
      usuariosFiltrados = usuariosFiltrados.filter(usuario => 
        usuario.epsName === this.filtroEps
      );
    }
    if (this.filtroCiudad) {
      usuariosFiltrados = usuariosFiltrados.filter(usuario => 
        usuario.cityName === this.filtroCiudad
      );
    }

    this.usuariosFiltrados = usuariosFiltrados;
    this.paginaActual = 1; 
    this.actualizarPaginacion();
  }

  limpiarFiltros(): void {
    this.filtroEps = '';
    this.filtroCiudad = '';
    this.aplicarFiltros();
  }

  actualizarPaginacion(): void {
    const totalPaginas = Math.ceil(this.usuariosFiltrados.length / this.itemsPorPagina);
    this.paginasArray = [];
    
    for (let i = 1; i <= totalPaginas; i++) {
      this.paginasArray.push(i);
    }

    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.usuariosPaginados = this.usuariosFiltrados.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.usuariosFiltrados.length / this.itemsPorPagina);
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  siguientePagina(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPaginacion();
    }
  }
}