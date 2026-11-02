import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { AppEvent, EventStatus } from '../../models/models';
import { CreateEventComponent } from '../create-event/create-event';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, CreateEventComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  @ViewChild(CreateEventComponent) createEventComponent: CreateEventComponent | undefined;

  events: AppEvent[] = [];
  filteredEvents: AppEvent[] = [];
  searchQuery = '';
  selectedStatus: EventStatus | 'All' = 'All';
  selectedType = 'All';
  totalDocs = 0;
  expiringCount = 0;
  isLoading = false;
  statusOptions: (EventStatus | 'All')[] = ['All', 'Active', 'Completed', 'Pending', 'Archived'];
  typeOptions: string[] = [];

  constructor(
    private eventService: EventService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.filteredEvents = [...events];
        this.totalDocs = this.eventService.getTotalDocCount(events);
        this.expiringCount = this.eventService.getExpiringDocuments(events, 60).length;
        this.typeOptions = ['All', ...new Set(events.map(e => e.type))];
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter(e => {
      const matchSearch = !this.searchQuery ||
        e.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        e.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        e.tags.some(t => t.toLowerCase().includes(this.searchQuery.toLowerCase()));
      const matchStatus = this.selectedStatus === 'All' || e.status === this.selectedStatus;
      const matchType = this.selectedType === 'All' || e.type === this.selectedType;
      return matchSearch && matchStatus && matchType;
    });
  }

  onSearchChange(): void { this.applyFilters(); }
  onStatusChange(): void { this.applyFilters(); }
  onTypeChange(): void { this.applyFilters(); }

  openEvent(id: string): void {
    this.router.navigate(['/event', id]);
  }

  getDocCount(event: AppEvent): number {
    return event.subSections.reduce((sum, ss) => sum + ss.documents.length, 0);
  }

  getCompletedSections(event: AppEvent): number {
    return event.subSections.filter(ss => ss.documents.length > 0).length;
  }

  getProgress(event: AppEvent): number {
    const required = event.subSections.filter(ss => ss.isRequired).length;
    if (required === 0) return 100;
    const filled = event.subSections.filter(ss => ss.isRequired && ss.documents.length > 0).length;
    return Math.round((filled / required) * 100);
  }

  getActiveCount(): number { return this.events.filter(e => e.status === 'Active').length; }
  getCompletedCount(): number { return this.events.filter(e => e.status === 'Completed').length; }
  getPendingCount(): number { return this.events.filter(e => e.status === 'Pending').length; }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = 'All';
    this.selectedType = 'All';
    this.applyFilters();
  }

  onEventCreated(): void {
    this.loadEvents();
  }
}
