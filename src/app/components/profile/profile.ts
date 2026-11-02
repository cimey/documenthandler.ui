import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+31 6 12345678',
    company: 'TechCorp NL',
    country: 'Netherlands',
    joinDate: '2026-01-06',
    avatar: 'JD'
  };

  isEditing = false;
  editData = { ...this.profileData };

  constructor(private router: Router) {}

  ngOnInit(): void {}

  startEditing(): void {
    this.editData = { ...this.profileData };
    this.isEditing = true;
  }

  saveProfile(): void {
    this.profileData = { ...this.editData };
    this.isEditing = false;
  }

  cancelEditing(): void {
    this.isEditing = false;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
