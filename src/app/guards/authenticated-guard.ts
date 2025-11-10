import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const AuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    if (authService.isDoctor()) {
      router.navigate(['/home-doctor']);
    } else {
      router.navigate(['/home-private']);
    }
    return false;
  } else {
    return true;
  }
};
