import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../web-socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Message } from '../interfaces/message.interface';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy, OnChanges {
  @Input() recipient: string = ''; // Receive the selected friend's username
  message: string = '';
  messages: Message[] = [];
  username: string = '';
  selectedFiles: File[] = [];
  blobUrls: string[] = []; // Keep track of Blob URLs
  isAtBottom: boolean = true; // To track if user is at the bottom

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    private router: Router,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.webSocketService.registerUsername(this.username);
    
    // Load previous messages
    this.loadMessages();

    // Handle incoming WebSocket messages
    this.webSocketService.onMessage().subscribe((message: Message) => {
      if ((message.recipient === this.username && message.sender === this.recipient) ||
          (message.sender === this.username && message.recipient === this.recipient)) {
        const isDuplicate = this.messages.some((msg: Message) =>
          msg.content === message.content && msg.timestamp === message.timestamp && msg.sender === message.sender
        );
        if (!isDuplicate) {
          this.messages.push(message);
          this.saveMessages();  // Save messages to localStorage
          this.scrollToBottomIfNeeded(); // Conditionally scroll to the bottom
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recipient']) {
      this.loadMessages(); // Reload messages when recipient changes
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottomIfNeeded(); // Conditionally scroll to the bottom after view checked
  }

  ngOnDestroy(): void {
    // Revoke all Blob URLs when the component is destroyed
    this.blobUrls.forEach(url => URL.revokeObjectURL(url));
  }

  saveMessages() {
    localStorage.setItem('messages', JSON.stringify(this.messages));
  }

  loadMessages() {
    const storedMessages: Message[] = JSON.parse(localStorage.getItem('messages') || '[]');
    const filteredMessages = storedMessages.filter((msg: Message) =>
      (msg.recipient === this.username && msg.sender === this.recipient) ||
      (msg.sender === this.username && msg.recipient === this.recipient)
    );
  
    this.messages = filteredMessages;
  }

  sendMessage() {
    if (this.message.trim() || this.selectedFiles.length > 0) {
      const newMessage: Message = {
        content: this.message,
        sender: this.username,
        recipient: this.recipient,
        timestamp: new Date().toISOString(),
        images: [],
        videos: [],
        documents: []
      };
  
      this.selectedFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          newMessage.images?.push({
            url: URL.createObjectURL(file),
            type: file.type
          });
        } else if (file.type.startsWith('video/')) {
          newMessage.videos?.push({
            url: URL.createObjectURL(file),
            type: file.type
          });
        } else if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
          newMessage.documents?.push({
            url: URL.createObjectURL(file),
            type: file.type,
            name: file.name
          });
        }
      });
  
      this.webSocketService.sendMessage(newMessage);
      this.messages.push(newMessage);
      this.saveMessages();  // Save messages to localStorage
      this.message = '';  // Clear the input
      this.selectedFiles = [];  // Clear the selected files
      this.scrollToBottomIfNeeded(); // Conditionally scroll to the bottom
    }
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files); // Convert FileList to array
      // Validate file types
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const invalidFiles = files.filter(file => !validTypes.includes(file.type));
  
      if (invalidFiles.length > 0) {
        alert('Unsupported file type');
      } else {
        this.selectedFiles = files;
      }
    }
  }

  goBack() {
    this.router.navigate(['/main']);
  }

  onScroll(): void {
    const threshold = 100; // Distance from bottom in pixels to trigger auto-scroll
    const chatContainerEl = this.chatContainer.nativeElement;
    this.isAtBottom = chatContainerEl.scrollHeight - chatContainerEl.scrollTop <= chatContainerEl.clientHeight + threshold;
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Failed to scroll to bottom:', err);
      }
    }, 0);
  }

  scrollToBottomIfNeeded(): void {
    if (this.isAtBottom) {
      this.scrollToBottom();
    }
  }
}
