import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-masseage',
  templateUrl: './masseage.component.html',
  styleUrls: ['./masseage.component.css']
})
export class MasseageComponent implements OnInit {
  messages: any[] = [];
  newMessage: string = '';
  senderId: string = '';
  recipientId: string = '60d5ec49d3b21c001f8e4f4e'; // Example recipient user ObjectId

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.senderId = userId;
    } else {
      console.log("User ID is not defined");
    }
    
    // Listen for new messages
    this.socketService.onMessage().subscribe((message) => {
      this.messages.push(message); // Add the received message to the messages array
      console.log("Received message:", message);
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.socketService.sendMessage(this.newMessage, this.senderId, this.recipientId);
      this.newMessage = ''; // Clear the input field after sending
      console.log("Sent message:", this.newMessage);
    }
  }
  
}
