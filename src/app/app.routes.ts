import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard';
import { EventDetailComponent } from './components/event-detail/event-detail';
import { MockEventDetailComponent } from './components/mock-event-detail/mock-event-detail';
import { ProfileComponent } from './components/profile/profile';
import { SettingsComponent } from './components/settings/settings';
import { DocumentsComponent } from './components/documents/documents';
import { ViewDocumentComponent } from './components/view-document/view-document';
import { UnauthorizedLandingComponent } from './components/unauthorized-landing/unauthorized-landing';
import { authenticatedGuard } from './guards/authenticated.guard';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'welcome' },
	{ path: 'welcome', component: UnauthorizedLandingComponent },
	{ path: 'dashboard', component: DashboardComponent, canActivate: [authenticatedGuard] },
	{ path: 'event/:id', component: EventDetailComponent, canActivate: [authenticatedGuard] },
	{ path: 'mock-event/:id', component: MockEventDetailComponent, canActivate: [authenticatedGuard] },
	{ path: 'documents', component: DocumentsComponent, canActivate: [authenticatedGuard] },
	{ path: 'view-document/:id/:eventId', component: ViewDocumentComponent, canActivate: [authenticatedGuard] },
	{ path: 'profile', component: ProfileComponent, canActivate: [authenticatedGuard] },
	{ path: 'settings', component: SettingsComponent, canActivate: [authenticatedGuard] },
	{ path: '**', redirectTo: 'welcome' }
];
