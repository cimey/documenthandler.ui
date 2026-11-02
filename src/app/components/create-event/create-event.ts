import { ChangeDetectorRef, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.scss'
})
export class CreateEventComponent implements OnInit {
  @Output() eventCreated = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  isOpen = false;
  formData = {
    title: '',
    type: 'General',
    description: '',
    date: new Date().toISOString().split('T')[0]
  };

  eventTypes = [
    { title: 'Vehicle Purchase', value: 0 },
    { title: 'Property Purchase', value: 1 },
    { title: 'Medical', value: 2 },
    { title: 'Travel', value: 3 },
    { title: 'Job', value: 4 },
    { title: 'Renovation', value: 5 },
    { title: 'Other', value: 6 }
  ];

  constructor(
    private eventService: EventService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  openDialog(): void {
    this.isOpen = true;
  }

  closeDialog(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  resetForm(): void {
    this.formData = {
      title: '',
      type: 'General',
      description: '',
      date: new Date().toISOString().split('T')[0]
    };
  }

  isSubmitting = false;

  submitForm(): void {
    if (this.formData.title.trim() && !this.isSubmitting) {
      this.isSubmitting = true;
      this.eventService.createEvent({
        title: this.formData.title,
        eventType: this.formData.type,
        description: this.formData.description,
        eventDate: this.formData.date
      }).subscribe({
        next: () => {
          this.resetForm();
          this.closeDialog();
          this.eventCreated.emit();
          this.isSubmitting = false;
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.isSubmitting = false;
          this.changeDetectorRef.markForCheck();
        }
      });
    }
  }

  handleBackdropClick(): void {
    this.closeDialog();
  }
}
