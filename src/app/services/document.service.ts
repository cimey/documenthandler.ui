import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
import { DocFile } from '../models/models';

interface PresignedUpload {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

interface DocumentResponse {
  id: string;
  name: string;
  category: string;
  fileType: string;
  size: string;
  uploadedAtUtc: string;
  expiresAtUtc?: string;
  referenceNumber?: string;
  notes?: string;
  fileUrl: string;
  tags: string[];
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly apiUrl = 'http://localhost:8080/api';
  private readonly http = inject(HttpClient);

  upload(file: File, eventId: string, subSectionId: string): Observable<DocumentResponse> {
    const contentType = file.type || 'application/octet-stream';

    return this.http.post<PresignedUpload>(`${this.apiUrl}/documents/presigned-url`, {
      fileName: file.name,
      contentType
    }).pipe(
      switchMap((signed) =>
        this.http.put(signed.uploadUrl, file, {
          headers: { 'Content-Type': contentType },
          responseType: 'text'
        }).pipe(switchMap(() => this.notifyUpload(file, signed.fileUrl)))
      ),
      switchMap((document) =>
        this.http.post(`${this.apiUrl}/document-events`, {
          documentId: document.id,
          eventId,
          subSectionId: this.isGuid(subSectionId) ? subSectionId : null
        }).pipe(map(() => document))
      )
    );
  }

  toDocFile(document: DocumentResponse): DocFile {
    return {
      id: document.id,
      name: document.name,
      category: 'Other',
      fileType: this.fileType(document.fileType),
      uploadDate: document.uploadedAtUtc,
      expiryDate: document.expiresAtUtc,
      size: document.size,
      tags: document.tags,
      referenceNumber: document.referenceNumber,
      notes: document.notes,
      fileUrl: document.fileUrl
    };
  }

  private notifyUpload(file: File, fileUrl: string): Observable<DocumentResponse> {
    return this.http.post<DocumentResponse>(`${this.apiUrl}/documents`, {
      name: file.name,
      category: 'Other',
      fileType: this.extension(file.name),
      size: this.formatFileSize(file.size),
      expiresAtUtc: null,
      referenceNumber: null,
      notes: null,
      fileUrl,
      tags: ['uploaded']
    });
  }

  private extension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || 'bin';
  }

  private fileType(value: string): DocFile['fileType'] {
    const supported: DocFile['fileType'][] = ['pdf', 'jpg', 'png', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
    return supported.includes(value as DocFile['fileType']) ? value as DocFile['fileType'] : 'txt';
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const unit = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round((bytes / Math.pow(1024, unit)) * 10) / 10} ${units[unit]}`;
  }

  private isGuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }
}
