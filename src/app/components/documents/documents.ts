import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDataService } from '../../services/mock-data.service';

interface DocumentWithContext {
  id: string;
  name: string;
  category: string;
  fileType: string;
  uploadDate: string;
  expiryDate?: string;
  size: string;
  tags: string[];
  referenceNumber?: string;
  eventTitle: string;
  eventId: string;
  subSectionName: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html',
  styleUrl: './documents.scss'
})
export class DocumentsComponent implements OnInit {
  allDocuments: DocumentWithContext[] = [];
  filteredDocuments: DocumentWithContext[] = [];
  searchQuery = '';
  selectedCategory = 'All';
  selectedStatus = 'All';
  sortBy = 'newest';

  categories: string[] = [];
  statuses = ['All', 'Valid', 'Expiring Soon', 'Expired'];

  constructor(private dataService: MockDataService, private router: Router) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.allDocuments = [];
    const events = this.dataService.getEvents();

    for (const event of events) {
      for (const section of event.subSections) {
        for (const doc of section.documents) {
          this.allDocuments.push({
            ...doc,
            eventTitle: event.title,
            eventId: event.id,
            subSectionName: section.title
          });
        }
      }
    }

    this.categories = ['All', ...new Set(this.allDocuments.map(d => d.category))];
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredDocuments = this.allDocuments.filter(doc => {
      const matchSearch = !this.searchQuery ||
        doc.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        doc.eventTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        doc.tags.some(t => t.toLowerCase().includes(this.searchQuery.toLowerCase()));

      const matchCategory = this.selectedCategory === 'All' || doc.category === this.selectedCategory;

      let matchStatus = true;
      if (this.selectedStatus !== 'All') {
        if (this.selectedStatus === 'Valid') {
          matchStatus = !doc.expiryDate || new Date(doc.expiryDate) > new Date();
        } else if (this.selectedStatus === 'Expiring Soon') {
          if (doc.expiryDate) {
            const diff = new Date(doc.expiryDate).getTime() - Date.now();
            matchStatus = diff > 0 && diff < 90 * 24 * 60 * 60 * 1000;
          } else {
            matchStatus = false;
          }
        } else if (this.selectedStatus === 'Expired') {
          matchStatus = doc.expiryDate ? new Date(doc.expiryDate) < new Date() : false;
        }
      }

      return matchSearch && matchCategory && matchStatus;
    });

    this.sortDocuments();
  }

  sortDocuments(): void {
    this.filteredDocuments.sort((a, b) => {
      if (this.sortBy === 'newest') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      } else if (this.sortBy === 'oldest') {
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      } else if (this.sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (this.sortBy === 'expiring') {
        const getExpiryTime = (doc: DocumentWithContext) => {
          return doc.expiryDate ? new Date(doc.expiryDate).getTime() : Infinity;
        };
        return getExpiryTime(a) - getExpiryTime(b);
      }
      return 0;
    });
  }

  onSearchChange(): void { this.applyFilters(); }
  onCategoryChange(): void { this.applyFilters(); }
  onStatusChange(): void { this.applyFilters(); }
  onSortChange(): void { this.sortDocuments(); }

  viewDocument(doc: DocumentWithContext): void {
    this.router.navigate(['/view-document', doc.id, doc.eventId]);
  }

  getStatusLabel(doc: DocumentWithContext): string {
    if (!doc.expiryDate) return 'Valid';
    const expiry = new Date(doc.expiryDate);
    const now = new Date();
    if (expiry < now) return 'Expired';
    const diff = expiry.getTime() - now.getTime();
    if (diff < 90 * 24 * 60 * 60 * 1000) return 'Expiring Soon';
    return 'Valid';
  }

  getStatusClass(doc: DocumentWithContext): string {
    const status = this.getStatusLabel(doc);
    if (status === 'Expired') return 'expired';
    if (status === 'Expiring Soon') return 'expiring';
    return 'valid';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
