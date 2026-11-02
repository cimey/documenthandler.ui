import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';
import { DocFile } from '../../models/models';

@Component({
  selector: 'app-view-document',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-document.html',
  styleUrl: './view-document.scss'
})
export class ViewDocumentComponent implements OnInit {
  document: DocFile | undefined;
  eventTitle = '';
  eventId = '';
  subSectionName = '';
  documentNotFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: MockDataService
  ) {}

  ngOnInit(): void {
    const docId = this.route.snapshot.paramMap.get('id');
    const eventId = this.route.snapshot.paramMap.get('eventId');

    if (docId && eventId) {
      this.eventId = eventId;
      const event = this.dataService.getEventById(eventId);

      if (event) {
        this.eventTitle = event.title;

        // Find document across all sections
        for (const section of event.subSections) {
          const doc = section.documents.find(d => d.id === docId);
          if (doc) {
            this.document = doc;
            this.subSectionName = section.title;
            break;
          }
        }
      }

      if (!this.document) {
        this.documentNotFound = true;
      }
    } else {
      this.documentNotFound = true;
    }
  }

  goBack(): void {
    this.router.navigate(['/documents']);
  }

  goToEvent(): void {
    this.router.navigate(['/event', this.eventId]);
  }

  downloadDocument(): void {
    if (this.document) {
      // In a real app, this would trigger a download
      console.log('Downloading:', this.document.name);
    }
  }

  deleteDocument(): void {
    if (this.document && confirm(`Delete ${this.document.name}?`)) {
      // In a real app, this would delete the document
      console.log('Deleted:', this.document.name);
      this.goBack();
    }
  }

  isExpiringSoon(): boolean {
    if (!this.document || !this.document.expiryDate) return false;
    const diff = new Date(this.document.expiryDate).getTime() - Date.now();
    return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000;
  }

  isExpired(): boolean {
    if (!this.document || !this.document.expiryDate) return false;
    return new Date(this.document.expiryDate) < new Date();
  }

  getStatusLabel(): string {
    if (!this.document) return '';
    if (!this.document.expiryDate) return 'No expiry date';
    if (this.isExpired()) return 'Expired';
    if (this.isExpiringSoon()) return 'Expiring soon';
    return 'Valid';
  }

  getStatusClass(): string {
    if (!this.document) return '';
    if (this.isExpired()) return 'expired';
    if (this.isExpiringSoon()) return 'expiring';
    return 'valid';
  }
}
