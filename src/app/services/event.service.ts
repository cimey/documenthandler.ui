import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppEvent, DocFile } from '../models/models';
import { CreateEventRequest, CreateSubSectionRequest, UpdateSubSectionRequest } from '../models/events.model';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly apiUrl = 'http://localhost:8080/api/events';
  private http = inject(HttpClient);

  getEvents(): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(this.apiUrl);
  }

  getEventById(id: string): Observable<AppEvent> {
    return this.http.get<AppEvent>(`${this.apiUrl}/${id}`);
  }
  
  createEvent(data: CreateEventRequest): Observable<AppEvent> {
    return this.http.post<AppEvent>(this.apiUrl, data);
  }

  createEventSubsection(data: CreateSubSectionRequest): Observable<AppEvent> {
    return this.http.post<AppEvent>(`${this.apiUrl}/${data.eventId}/subsections`, data);
  }

  updateEventSubsection(
    eventId: string,
    subSectionId: string,
    data: UpdateSubSectionRequest
  ): Observable<AppEvent> {
    return this.http.put<AppEvent>(
      `${this.apiUrl}/${eventId}/subsections/${subSectionId}`,
      data
    );
  }

  deleteEventSubsection(eventId: string, subSectionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/subsections/${subSectionId}`);
  }

  getTotalDocCount(events: AppEvent[]): number {
    return events.reduce(
      (sum, e) => sum + e.subSections.reduce((s, ss) => s + ss.documents.length, 0),
      0
    );
  }

  getExpiringDocuments(events: AppEvent[], days: number): DocFile[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + days);
    const expiring: DocFile[] = [];
    for (const e of events) {
      for (const ss of e.subSections) {
        for (const doc of ss.documents) {
          if (doc.expiryDate && new Date(doc.expiryDate) <= cutoff) {
            expiring.push(doc);
          }
        }
      }
    }
    return expiring;
  }
}
