import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-unauthorized-landing',
  templateUrl: './unauthorized-landing.html',
  styleUrl: './unauthorized-landing.scss'
})
export class UnauthorizedLandingComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.auth.isAuthenticated$
      .pipe(
        filter((isAuthenticated) => isAuthenticated),
        take(1)
      )
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }

  login(): void {
    this.auth.loginWithRedirect({
      appState: { target: '/dashboard' }
    });
  }
}
