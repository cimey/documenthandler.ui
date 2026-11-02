import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { catchError, switchMap, take } from 'rxjs';

const tokenAllowedList = [/^\/api(\/|$)/i, /^https?:\/\/[^/]+\/api\//i];

function shouldAttachToken(url: string): boolean {
  return tokenAllowedList.some((pattern) => pattern.test(url));
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!shouldAttachToken(req.url)) {
    return next(req);
  }

  const auth = inject(AuthService);

  return auth.isAuthenticated$.pipe(
    take(1),
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        return next(req);
      }

      return auth.getAccessTokenSilently().pipe(
        take(1),
        switchMap((token) =>
          next(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            })
          )
        ),
        catchError(() => next(req))
      );
    })
  );
};
