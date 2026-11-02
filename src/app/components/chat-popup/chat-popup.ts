import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../services/mock-data.service';
import { ChatMessage } from '../../models/models';

@Component({
  selector: 'app-chat-popup',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-popup.html',
  styleUrl: './chat-popup.scss'
})
export class ChatPopupComponent implements AfterViewChecked {
  @ViewChild('messagesEnd') private messagesEnd!: ElementRef;

  isOpen = false;
  isTyping = false;
  inputText = '';
  messages: ChatMessage[] = [
    {
      id: 'welcome',
      role: 'assistant',
      content: '👋 Hi! I\'m your document assistant.\n\nI can help you find documents, check expiry dates, and answer questions about your events.\n\nTry asking: "What expires soon?" or "Find my RDW document"',
      timestamp: new Date()
    }
  ];

  private shouldScroll = false;

  constructor(private dataService: MockDataService) {}

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.shouldScroll = true;
  }

  closeChat(): void {
    this.isOpen = false;
  }

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text) return;

    this.messages.push({
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date()
    });

    this.inputText = '';
    this.isTyping = true;
    this.shouldScroll = true;

    setTimeout(() => {
      const response = this.dataService.getMockChatResponse(text);
      this.messages.push({
        id: `resp-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });
      this.isTyping = false;
      this.shouldScroll = true;
    }, 900 + Math.random() * 600);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.messages = this.messages.slice(0, 1);
  }

  private scrollToBottom(): void {
    try {
      this.messagesEnd.nativeElement.scrollIntoView({ behavior: 'smooth' });
    } catch {}
  }

  formatContent(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  getSuggestedQuestions(): string[] {
    return [
      'What expires soon?',
      'Show my insurance docs',
      'Find the RDW document',
      'How many contracts do I have?',
    ];
  }

  useSuggestion(q: string): void {
    this.inputText = q;
    this.sendMessage();
  }
}
