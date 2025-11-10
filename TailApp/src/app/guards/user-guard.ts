import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const UserGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUser()) {
    return true;
  } else if (authService.isDoctor()) {
    router.navigate(['/home-doctor']);
    return false;
  } else {
    router.navigate(['/login']);
    return false;
  }
};