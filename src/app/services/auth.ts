import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environment';
import { AuthResponseDTO } from '../interfaces/auth';
import { LoginDTO } from '../interfaces/loginDTO';
import { UserResponseDTO } from '../interfaces/userDTO';
import { DoctorResponseDTO } from '../interfaces/doctorDTO';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl || '';
  private isBrowser: boolean;  

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  login(request: LoginDTO): Observable<AuthResponseDTO> {
    const url = `${this.baseUrl}/auth/login`;
    
    
    return this.http.post<AuthResponseDTO>(url, request).pipe(
      tap(response => {

        console.log('Respuesta de autenticación recibida en el servicio:', response);
        this.saveSession(response);

      })
    );
  }

  saveSession(response: AuthResponseDTO): void {
    
    if (this.isBrowser) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  }

  logout(): void {

    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login']); 
  }

  isLoggedIn(): boolean {

    if (this.isBrowser) {
      return !!localStorage.getItem('token');
    }
    return false; 
  }

  getRole(): string | null {

    if (this.isBrowser) {
      return localStorage.getItem('role');
    }
    return null; 
  }

  isUser(): boolean {
    return this.getRole() === 'USER';
  }

  isDoctor(): boolean {
    return this.getRole() === 'DOCTOR';
  }

  getUser(): UserResponseDTO | DoctorResponseDTO | null {

    if (this.isBrowser) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null; 
  }

}
