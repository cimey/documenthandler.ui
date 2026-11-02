import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppEvent, SubSection, DocFile, FileType, DocumentCategory } from '../../models/models';
import { EventService } from '../../services/event.service';
import { DocumentService } from '../../services/document.service';

interface EventApiResponse {
  id: string;
  title?: string;
  type?: number | string;
  eventType?: number | string;
  status?: number | string;
  description?: string;
  date?: string;
  eventDate?: string;
  emoji?: string;
  colorClass?: string;
  tags?: string[];
  subSections?: unknown[];
}

interface SectionDraft {
  title: string;
  description: string;
  eventId: string;
  isRequired: boolean;
}

@Component({
  selector: 'app-event-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss'
})
export class EventDetailComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  event: AppEvent | undefined;
  isLoading = true;
  expandedSections = new Set<string>();
  uploadingSection: string | null = null;
  uploadError = '';
  sectionActionError = '';
  showCreateSectionForm = false;
  newSection: SectionDraft = this.createEmptySectionDraft();
  editingSectionId: string | null = null;
  editSection = { title: '', description: '' };
  sectionActionInProgress: string | null = null;

  private readonly eventTypeLabels: Record<number, string> = {
    0: 'Vehicle Purchase',
    1: 'Property Purchase',
    2: 'Medical',
    3: 'Travel',
    4: 'Job',
    5: 'Renovation',
    6: 'Other'
  };

  private readonly statusLabels: Record<number, string> = {
    0: 'Active',
    1: 'Completed',
    2: 'Pending',
    3: 'Archived'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: EventService,
    private documentService: DocumentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.isLoading = false;
      return;
    }
    this.newSection.eventId = id;

    this.dataService.getEventById(id).subscribe({
      next: (event) => {
        this.event = this.normalizeEvent(event as unknown as EventApiResponse);
        if (this.event) {
          this.event.subSections.forEach((section) => this.expandedSections.add(section.id));
        }
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.event = undefined;
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
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
    return this.event?.subSections.reduce((sum, ss) => sum + ss.documents.length, 0) ?? 0;
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

  getFileIcon(fileType: string): string {
    const icons: Record<string, string> = {
      pdf: '📕', jpg: '🖼️', png: '🖼️', docx: '📘', xlsx: '📗'
    };
    return icons[fileType] ?? '📄';
  }

  getFileType(fileType: string): string {
    return fileType.toUpperCase();
  }

  getCategoryColor(cat: string): string {
    const map: Record<string, string> = {
      Contract: 'blue', Government: 'purple', Insurance: 'green',
      Finance: 'amber', Warranty: 'teal', Service: 'rose', Other: 'gray'
    };
    return map[cat] ?? 'gray';
  }

  getProgress(): number {
    if (!this.event) return 0;
    const required = this.event.subSections.filter(ss => ss.isRequired).length;
    if (required === 0) return 100;
    const filled = this.event.subSections.filter(ss => ss.isRequired && ss.documents.length > 0).length;
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
    this.newSection.eventId = this.event.id;
    this.dataService.createEventSubsection(this.newSection).subscribe({
      next: (updatedEvent) => {
        this.event = this.normalizeEvent(updatedEvent as unknown as EventApiResponse);
        if (this.event) {
          this.event.subSections.forEach((section) => this.expandedSections.add(section.id));
        }
        this.showCreateSectionForm = false;
        this.newSection = this.createEmptySectionDraft();
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        // Handle error (e.g., show a notification)
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  startEditingSection(section: SubSection, event: MouseEvent): void {
    event.stopPropagation();
    this.sectionActionError = '';
    this.editingSectionId = section.id;
    this.editSection = {
      title: section.title,
      description: section.description
    };
  }

  cancelEditingSection(): void {
    this.editingSectionId = null;
    this.editSection = { title: '', description: '' };
  }

  saveSection(sectionId: string): void {
    if (!this.event || !this.editSection.title.trim() || this.sectionActionInProgress) {
      return;
    }

    this.sectionActionError = '';
    this.sectionActionInProgress = sectionId;
    this.dataService.updateEventSubsection(this.event.id, sectionId, {
      title: this.editSection.title.trim(),
      description: this.editSection.description.trim()
    }).subscribe({
      next: (updatedEvent) => {
        this.event = this.normalizeEvent(updatedEvent as unknown as EventApiResponse);
        this.cancelEditingSection();
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.sectionActionError = 'Could not update the section. Please try again.';
        this.sectionActionInProgress = null;
        this.changeDetectorRef.markForCheck();
      },
      complete: () => {
        this.sectionActionInProgress = null;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  deleteSection(section: SubSection, event: MouseEvent): void {
    event.stopPropagation();
    if (!this.event || this.sectionActionInProgress) {
      return;
    }

    const confirmed = window.confirm(`Delete "${section.title}" and remove it from this event?`);
    if (!confirmed) {
      return;
    }

    const eventId = this.event.id;
    this.sectionActionError = '';
    this.sectionActionInProgress = section.id;
    this.dataService.deleteEventSubsection(eventId, section.id).subscribe({
      next: () => {
        if (this.event) {
          this.event.subSections = this.event.subSections.filter(item => item.id !== section.id);
        }
        this.expandedSections.delete(section.id);
        if (this.editingSectionId === section.id) {
          this.cancelEditingSection();
        }
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.sectionActionError = 'Could not delete the section. Please try again.';
        this.sectionActionInProgress = null;
        this.changeDetectorRef.markForCheck();
      },
      complete: () => {
        this.sectionActionInProgress = null;
        this.changeDetectorRef.markForCheck();
      }
    });
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
      const section = this.event?.subSections.find(ss => ss.id === this.uploadingSection);

      if (!section || !this.event) return;

      this.uploadError = '';
      this.documentService.upload(file, this.event.id, section.id).subscribe({
        next: (document) => {
          section.documents.push(this.documentService.toDocFile(document));
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.uploadError = `Could not upload ${file.name}. Please try again.`;
          this.uploadingSection = null;
          input.value = '';
          this.changeDetectorRef.markForCheck();
        },
        complete: () => {
          this.uploadingSection = null;
          input.value = '';
          this.changeDetectorRef.markForCheck();
        }
      });
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

  private normalizeEvent(event: EventApiResponse | undefined): AppEvent | undefined {
    if (!event?.id) {
      return undefined;
    }

    const type = this.toEventTypeLabel(event.type ?? event.eventType);

    return {
      id: event.id,
      title: event.title?.trim() || 'Untitled event',
      type,
      status: this.toStatusLabel(event.status),
      description: event.description?.trim() || 'No description yet. Add sections below and start uploading supporting files.',
      eventDate: event.eventDate || event.date || new Date().toISOString(),
      emoji: event.emoji || this.getEmojiForType(type),
      colorClass: event.colorClass || this.getColorForType(type),
      tags: Array.isArray(event.tags) ? event.tags : [],
      subSections: Array.isArray(event.subSections)
        ? event.subSections.map((section, index) => this.normalizeSection(section, index))
        : []
    };
  }

  private normalizeSection(section: unknown, index: number): SubSection {
    const value = (section ?? {}) as Record<string, unknown>;
    const name = this.readString(value, ['name', 'title']) || `Section ${index + 1}`;
    const rawDocuments = Array.isArray(value['documents'])
      ? (value['documents'] as unknown[])
      : Array.isArray(value['files'])
        ? (value['files'] as unknown[])
        : [];

    return {
      id: this.readString(value, ['id']) || `section-${index + 1}`,
      title: name,
      icon: this.readString(value, ['icon']) || name.charAt(0).toUpperCase(),
      description: this.readString(value, ['description']) || '',
      isRequired: this.readBoolean(value, ['isRequired', 'required']),
      documents: rawDocuments.map((document, docIndex) => this.normalizeDocument(document, docIndex))
    };
  }

  private normalizeDocument(document: unknown, index: number): DocFile {
    const value = (document ?? {}) as Record<string, unknown>;
    const name = this.readString(value, ['name', 'fileName']) || `Document ${index + 1}`;
    const fileType = this.normalizeFileType(this.readString(value, ['fileType', 'extension']) || name);

    return {
      id: this.readString(value, ['id']) || `doc-${index + 1}`,
      name,
      category: this.normalizeCategory(this.readString(value, ['category'])),
      fileType,
      uploadDate: this.readString(value, ['uploadDate', 'createdAtUtc']) || new Date().toISOString(),
      expiryDate: this.readString(value, ['expiryDate']),
      size: this.readString(value, ['size']) || 'Unknown size',
      tags: Array.isArray(value['tags']) ? (value['tags'] as string[]) : [],
      referenceNumber: this.readString(value, ['referenceNumber']),
      notes: this.readString(value, ['notes']),
      fileUrl: this.readString(value, ['fileUrl'])
    };
  }

  private toEventTypeLabel(type: number | string | undefined): string {
    if (typeof type === 'number') {
      return this.eventTypeLabels[type] ?? 'Other';
    }

    if (typeof type === 'string' && type.trim()) {
      return type;
    }

    return 'Other';
  }

  private toStatusLabel(status: number | string | undefined): AppEvent['status'] {
    if (typeof status === 'number') {
      return (this.statusLabels[status] ?? 'Pending') as AppEvent['status'];
    }

    if (typeof status === 'string' && status.trim()) {
      const normalized = status.trim().toLowerCase();
      if (normalized === 'active' || normalized === 'completed' || normalized === 'pending' || normalized === 'archived') {
        return this.capitalize(normalized) as AppEvent['status'];
      }
    }

    return 'Pending';
  }

  private normalizeCategory(category: string | undefined): DocumentCategory {
    const allowed: DocumentCategory[] = ['Contract', 'Government', 'Insurance', 'Finance', 'Warranty', 'Service', 'Other'];
    return allowed.includes(category as DocumentCategory) ? (category as DocumentCategory) : 'Other';
  }

  private normalizeFileType(value: string): FileType {
    const normalized = value.includes('.') ? value.split('.').pop() || value : value;
    const candidate = normalized.toLowerCase() as FileType;
    const allowed: FileType[] = ['pdf', 'jpg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
    return allowed.includes(candidate) ? candidate : 'pdf';
  }

  private readString(value: Record<string, unknown>, keys: string[]): string | undefined {
    for (const key of keys) {
      const candidate = value[key];
      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate;
      }
    }

    return undefined;
  }

  private readBoolean(value: Record<string, unknown>, keys: string[]): boolean {
    for (const key of keys) {
      if (typeof value[key] === 'boolean') {
        return value[key] as boolean;
      }
    }

    return false;
  }

  private getEmojiForType(type: string): string {
    const emojiMap: Record<string, string> = {
      'Vehicle Purchase': '🚗',
      'Property Purchase': '🏠',
      Medical: '🏥',
      Travel: '✈️',
      Job: '💼',
      Renovation: '🏗️',
      Other: '📁'
    };

    return emojiMap[type] ?? '📁';
  }

  private getColorForType(type: string): string {
    const colorMap: Record<string, string> = {
      'Vehicle Purchase': 'blue',
      'Property Purchase': 'green',
      Medical: 'rose',
      Travel: 'teal',
      Job: 'purple',
      Renovation: 'amber',
      Other: 'gray'
    };

    return colorMap[type] ?? 'gray';
  }

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private createEmptySectionDraft(): SectionDraft {
    return {
      title: '',
      description: '',
      isRequired: true,
      eventId:  ''
    };
  }
}
