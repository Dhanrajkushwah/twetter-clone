import { Component } from '@angular/core';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  notifications: any[] = [];

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    // Listen for notifications
    this.socketService.onNotification().subscribe((notification) => {
      this.notifications.push(notification);
    });
  }
}