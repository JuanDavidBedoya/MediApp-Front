import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { AppointmentRequestDTO, AppointmentResponseDTO} from '../interfaces/appointmentDTO';
import { SpecialityResponseDTO } from '../interfaces/specialityDTO';
import { DoctorResponseDTO } from '../interfaces/doctorDTO';

export type AvailableTimeSlots = string[];

export type AppointmentFilter = 'TODAY' | 'WEEK' | 'MONTH' | 'CUSTOM';

@Injectable({
    providedIn: 'root',
})
export class AppointmentService {
    private apiUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) { }

    getSpecialities(): Observable<SpecialityResponseDTO[]> {
        return this.http.get<SpecialityResponseDTO[]>(`${this.apiUrl}/specialities`);
    }

    getDoctorsBySpeciality(specialityName: string): Observable<DoctorResponseDTO[]> {
        return this.http.get<DoctorResponseDTO[]>(
            `${this.apiUrl}/doctors/bySpeciality?speciality=${specialityName}`
        );
    }

    getAvailableSlots(
        doctorCedula: string,
        date: string
    ): Observable<AvailableTimeSlots> {
        return this.http.get<AvailableTimeSlots>(
            `${this.apiUrl}/appointments/available-slots?cedula=${doctorCedula}&date=${date}`
        );
    }

    scheduleAppointment(
        request: AppointmentRequestDTO
    ): Observable<AppointmentResponseDTO> {
        return this.http.post<AppointmentResponseDTO>(
            `${this.apiUrl}/appointments`,
            request
        );
    }

    getDoctorAppointments(
        doctorCedula: string,
        filter: AppointmentFilter,
        customDate?: string
    ): Observable<AppointmentResponseDTO[]> {

    let params = new HttpParams()
      .set('doctorCedula', doctorCedula)
      .set('filterType', filter);

    if (filter === 'CUSTOM' && customDate) {
      console.log('Enviando fecha al backend:', customDate);
      params = params.set('date', customDate);
    }
    return this.http.get<AppointmentResponseDTO[]>(`${this.apiUrl}/appointments/doctor`, { params });
  }

  createFormula(formulaRequest: { appointmentId: string; date: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/formulas`, formulaRequest);
  }
}