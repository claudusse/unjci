import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from './auth.service';

export const roleGuard = (role: UserRole): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const session = auth.getSession();

  if (!session) return router.createUrlTree(['/login']);
  if (session.role !== role) {
    return router.createUrlTree([
      session.role === 'admin' ? '/administration' : '/espace-membre',
    ]);
  }
  return true;
};
