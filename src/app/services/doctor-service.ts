import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { DoctorRequestDTO, DoctorResponseDTO, DoctorUpdateDTO } from '../interfaces/doctorDTO';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {

  private doctorApiUrl = `${environment.apiUrl}/doctors`;
  private registerApiUrl = `${environment.apiUrl}/auth/register/doctor`;

  constructor(private http: HttpClient) { }

  registrarDoctor(
    doctor: DoctorRequestDTO
  ): Observable<DoctorResponseDTO> {
    return this.http.post<DoctorResponseDTO>(this.registerApiUrl, doctor);
  }

  getDoctor(cedula: string): Observable<DoctorResponseDTO> {
    return this.http.get<DoctorResponseDTO>(`${this.doctorApiUrl}/${cedula}`);
  }

  actualizarDoctor(
    cedula: string,
    doctor: DoctorUpdateDTO
  ): Observable<DoctorResponseDTO> {
    return this.http.put<DoctorResponseDTO>(`${this.doctorApiUrl}/${cedula}`, doctor);
  }
}