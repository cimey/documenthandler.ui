import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {
  settingsData = {
    theme: 'light',
    notifications: true,
    emailNotifications: true,
    autoSync: true,
    language: 'English'
  };

  languages = ['English', 'Dutch', 'German', 'French', 'Spanish'];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleNotifications(): void {
    this.settingsData.notifications = !this.settingsData.notifications;
  }

  toggleEmailNotifications(): void {
    this.settingsData.emailNotifications = !this.settingsData.emailNotifications;
  }

  toggleAutoSync(): void {
    this.settingsData.autoSync = !this.settingsData.autoSync;
  }

  saveSettings(): void {
    // In a real app, this would save to a backend
    console.log('Settings saved:', this.settingsData);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
