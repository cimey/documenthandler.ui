import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { combineLatest } from 'rxjs';
import { ChatPopupComponent } from './components/chat-popup/chat-popup';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ChatPopupComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  constructor(
    private router: Router,
    public auth: AuthService
  ) {
    combineLatest([
      this.auth.isLoading$,
      this.auth.isAuthenticated$
    ]).subscribe(([isLoading, isAuthenticated]) => {
      console.log('Auth0 state:', {
        url: this.router.url,
        isLoading,
        isAuthenticated
      });
    });
  }

  get isPublicRoute(): boolean {
    return this.router.url.startsWith('/welcome');
  }
}