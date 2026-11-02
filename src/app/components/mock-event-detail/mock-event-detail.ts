import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppEvent, DocFile, DocumentCategory, FileType, SubSection } from '../../models/models';
import { MockDataService } from '../../services/mock-data.service';

interface SectionDraft {
  name: string;
  description: string;
  isRequired: boolean;
}

@Component({
  selector: 'app-mock-event-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './mock-event-detail.html',
  styleUrl: './mock-event-detail.scss'
})
export class MockEventDetailComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  event: AppEvent | undefined;
  isLoading = true;
  expandedSections = new Set<string>();
  uploadingSection: string | null = null;
  showCreateSectionForm = false;
  newSection: SectionDraft = this.createEmptySectionDraft();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mockDataService: MockDataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.event = id ? this.mockDataService.getEventById(id) : undefined;

    if (this.event) {
      this.event.subSections.forEach((section) => this.expandedSections.add(section.id));
    }

    this.isLoading = false;
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  toggleSection(id: string): void {
    this.expandedSections.has(id) ? this.expandedSections.delete(id) : this.expandedSections.add(id);
  }

  isSectionExpanded(id: string): boolean {
    return this.expandedSections.has(id);
  }

  getTotalDocs(): number {
    return this.event?.subSections.reduce((sum, section) => sum + section.documents.length, 0) ?? 0;
  }

  isExpiringSoon(doc: DocFile): boolean {
    if (!doc.expiryDate) return false;
    const diff = new Date(doc.expiryDate).getTime() - Date.now();
    return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000;
  }

  isExpired(doc: DocFile): boolean {
    if (!doc.expiryDate) return false;
    return new Date(doc.expiryDate) < new Date();
  }

  getFileType(fileType: string): string {
    return fileType.toUpperCase();
  }

  getCategoryColor(category: string): string {
    const map: Record<string, string> = {
      Contract: 'blue',
      Government: 'purple',
      Insurance: 'green',
      Finance: 'amber',
      Warranty: 'teal',
      Service: 'rose',
      Other: 'gray'
    };
    return map[category] ?? 'gray';
  }

  getProgress(): number {
    if (!this.event) return 0;
    const required = this.event.subSections.filter((section) => section.isRequired).length;
    if (required === 0) return 100;
    const filled = this.event.subSections.filter((section) => section.isRequired && section.documents.length > 0).length;
    return Math.round((filled / required) * 100);
  }

  getStatusClass(): string {
    return this.event?.status.toLowerCase() ?? 'pending';
  }

  openCreateSectionForm(): void {
    this.showCreateSectionForm = true;
  }

  cancelCreateSection(): void {
    this.showCreateSectionForm = false;
    this.newSection = this.createEmptySectionDraft();
  }

  createSection(): void {
    if (!this.event) {
      return;
    }

    const name = this.newSection.name.trim();
    const description = this.newSection.description.trim();

    if (!name) {
      return;
    }

    const section: SubSection = {
      id: `section-${Date.now()}`,
      title: name,
      description,
      icon: name.charAt(0).toUpperCase(),
      documents: [],
      isRequired: this.newSection.isRequired
    };

    this.event.subSections = [...this.event.subSections, section];
    this.expandedSections.add(section.id);
    this.cancelCreateSection();
  }

  triggerFileUpload(sectionId: string): void {
    this.uploadingSection = sectionId;
    this.fileInput?.nativeElement?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (files && files.length > 0 && this.uploadingSection) {
      const file = files[0];
      const section = this.event?.subSections.find((item) => item.id === this.uploadingSection);

      if (section) {
        const newDoc: DocFile = {
          id: `doc-${Date.now()}`,
          name: file.name,
          category: 'Other',
          fileType: this.getFileTypeFromName(file.name),
          uploadDate: new Date().toISOString().split('T')[0],
          size: this.formatFileSize(file.size),
          tags: ['uploaded'],
          referenceNumber: undefined,
          expiryDate: undefined
        };

        section.documents.push(newDoc);
      }

      this.uploadingSection = null;
      input.value = '';
    }
  }

  private getFileTypeFromName(fileName: string): FileType {
    const ext = fileName.split('.').pop()?.toLowerCase() || 'pdf';
    const allowedTypes: FileType[] = ['pdf', 'jpg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
    return allowedTypes.includes(ext as FileType) ? (ext as FileType) : 'pdf';
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + sizes[i];
  }

  private createEmptySectionDraft(): SectionDraft {
    return {
      name: '',
      description: '',
      isRequired: true
    };
  }
}
