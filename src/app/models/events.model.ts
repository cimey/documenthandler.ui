
export interface CreateEventRequest {
  title: string;
  eventType: string;
  description: string;
  eventDate: string;
}

export interface CreateSubSectionRequest {
  title: string;
  description: string;
  eventId: string;
}

export interface UpdateSubSectionRequest {
  title: string;
  description: string;
}
