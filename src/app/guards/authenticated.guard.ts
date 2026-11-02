import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { filter, map, switchMap, take } from 'rxjs';

export const authenticatedGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Wait for Auth0 to finish loading the session before checking auth state.
  // Without this, isAuthenticated$ emits false on refresh before the session
  // is restored, causing a spurious redirect to /welcome.
  return auth.isLoading$.pipe(
    filter((isLoading) => !isLoading),
    take(1),
    switchMap(() => auth.isAuthenticated$),
    take(1),
    map((isAuthenticated) => (isAuthenticated ? true : router.createUrlTree(['/welcome'])))
  );
};
