import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { UserRequestDTO, UserResponseDTO, UserUpdateDTO } from '../interfaces/userDTO';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = `${environment.apiUrl}/auth/register`;
  private userApiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: UserRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(this.apiUrl, usuario);
  }

  getUsuario(cedula: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${this.userApiUrl}/${cedula}`);
  }

  actualizarUsuario(
    cedula: string,
    usuario: UserUpdateDTO
  ): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${this.userApiUrl}/${cedula}`, usuario);
  }

  getAllUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(this.userApiUrl);
  }

  getUsersByEps(epsName: string): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.userApiUrl}/eps/${epsName}`);
  }

  getUsersByCity(cityName: string): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.userApiUrl}/city/${cityName}`);
  }
}
