import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html'
})
export class Header {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isUser(): boolean {
    return this.authService.isUser();
  }

  get isDoctor(): boolean {
    return this.authService.isDoctor();
  }

  logout(): void {
    this.authService.logout();
  }

}
