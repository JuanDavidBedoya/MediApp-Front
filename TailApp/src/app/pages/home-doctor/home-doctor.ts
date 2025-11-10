import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home-doctor',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './home-doctor.html'
})
export class HomeDoctor {


  constructor(private authService: AuthService) { }

  get userName(): string | null {
    const user = this.authService.getUser();

    return user ? (user as any).name || (user as any).nombre : null; 
  }

  get userRole(): string | null {
    return this.authService.getRole();
  }
  
}