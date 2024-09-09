import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Message } from './interfaces/message.interface'; // Import the Message interface

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    this.listenForPreviousMessages();
  }

  registerUsername(username: string) {
    localStorage.setItem('username', username); // Store username locally
    this.socket.emit('register', username);
  }

  sendMessage(message: Message) {
    console.log('Sending message:', message); // Debug log
    this.socket.emit('sendMessage', message); // Send the message object, including the sender
    this.storeMessage(message); // Store the sent message locally
  }

  onMessage(): Observable<Message> {
    return new Observable(observer => {
      this.socket.on('newMessage', (data: Message) => {
        console.log('Received message:', data); // Debug log
        // Only pass the message to the observer if it is meant for the current user
        if (data.recipient === localStorage.getItem('username') || data.sender === localStorage.getItem('username')) {
          observer.next(data);
        }
      });
    });
  }

  private listenForPreviousMessages() {
    this.socket.on('previousMessages', (messages: Message[]) => {
      console.log('Received previous messages:', messages); // Debug log
      messages.forEach(message => this.storeMessageIfNew(message));
    });
  }

  getPreviousMessages(): Message[] {
    return JSON.parse(localStorage.getItem('messages') || '[]');
  }

  private storeMessageIfNew(message: Message) {
    const messages = this.getPreviousMessages();
    const isDuplicate = messages.some(msg => 
      msg.content === message.content &&
      msg.sender === message.sender &&
      msg.recipient === message.recipient &&
      msg.timestamp === message.timestamp
    );

    if (!isDuplicate) {
      messages.push(message);
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }

  private storeMessage(message: Message) {
    const messages = this.getPreviousMessages();
    messages.push(message);
    localStorage.setItem('messages', JSON.stringify(messages));
  }
}
