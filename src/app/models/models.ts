export type EventStatus = 'Active' | 'Completed' | 'Pending' | 'Archived';
export type DocumentCategory =
  | 'Contract'
  | 'Government'
  | 'Insurance'
  | 'Finance'
  | 'Warranty'
  | 'Service'
  | 'Other';
export type FileType = 'pdf' | 'jpg' | 'png' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'txt';

export interface DocFile {
  id: string;
  name: string;
  category: DocumentCategory;
  fileType: FileType;
  uploadDate: string;
  expiryDate?: string;
  size: string;
  tags: string[];
  referenceNumber?: string;
  notes?: string;
  fileUrl?: string;
}

export interface SubSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  documents: DocFile[];
  isRequired: boolean;
}

export interface AppEvent {
  id: string;
  title: string;
  type: string;
  status: EventStatus;
  eventDate: string;
  description: string;
  emoji: string;
  colorClass: string;
  subSections: SubSection[];
  tags: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
