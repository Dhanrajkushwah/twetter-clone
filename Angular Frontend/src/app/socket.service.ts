import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:5000'); // Backend server URL
  }

  // Send a message
  sendMessage(content: string, senderId: string, recipientId: string) {
    if (this.isValidObjectId(senderId) && this.isValidObjectId(recipientId)) {
      this.socket.emit('sendMessage', { content, senderId, recipientId });
    } else {
      console.error('Invalid senderId or recipientId');
    }
  }

  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  // Receive messages
  onMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receiveMessage', (message) => {
        observer.next(message);
      });
    });
  }
  onNotification(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receiveNotification', (notification) => {
        observer.next(notification);
      });
    });
  }

  // Emit a notification
  sendNotification(notification: any) {
    this.socket.emit('sendNotification', notification);
  }
}
