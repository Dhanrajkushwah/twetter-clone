import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserserviceService } from '../userservice.service';
import { TweetService } from '../tweet.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  followers: any[] = [];
  following: any[] = [];
  currentUserId: string = '';
  showMessages = false; // Initialize as an empty string
  loadingMore: any;
  userId: string = ''; // Define the userId property
  notifications: any[] = [];
  newTweetCount: number = 0;
 
  constructor(private tweetService: TweetService, private router: Router,private socketService: SocketService) {}

  ngOnInit(): void {
    debugger
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.currentUserId = userId;
      this.fetchFollowers();
      this.fetchFollowing();
      this.tweetService.getNewTweetNotification().subscribe(() => {
        this.newTweetCount++;
        this.notifications.push('New tweet created'); // Optional: Add more details to notification
      });
    } else {
      this.router.navigate(['/login']);
    }
    this.socketService.onNotification().subscribe((notification) => {
      this.notifications.push(notification);
    });
  }

  fetchFollowers() {
    this.tweetService.getFollowers(this.currentUserId).subscribe(
        (response: any) => {
            console.log("Raw Follower Response:", response); // Log raw response
            this.followers = response.followers || []; // Fallback to empty array if undefined
            console.log("Processed Follower Data", this.followers);
        },
        error => {
            console.error('Error fetching followers:', error);
        }
    );
}

fetchFollowing() {
    this.tweetService.getFollowing(this.currentUserId).subscribe(
        (response: any) => {
            console.log("Raw Following Response:", response); // Log raw response
            this.following = response.following || []; // Fallback to empty array if undefined
            console.log("Processed Following Data", this.following);
        },
        error => {
            console.error('Error fetching following:', error);
        }
    );
}


  followUser(followUserId: string) {
    this.tweetService.followUser(this.currentUserId, followUserId).subscribe(
      response => {
        alert('Followed user successfully!');
        this.fetchFollowing();  // Refresh the following list
      },
      error => {
        console.error('Error following user:', error);
        alert('Failed to follow user. Please try again.'); // Optional error message
      }
    );
  }

  postTweet() {
    // Tweet posting logic here
  }
  markNotificationsAsRead() {
    this.newTweetCount = 0;  // Reset the notification count
    this.notifications = []; // Clear the notifications
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // Remove userId on logout
    this.router.navigate(['/login']);
  }

  onScroll(event: any) {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight && !this.loadingMore) {
      // Load more tweets when user scrolls to bottom
    }
  }
  showMessagesComponent() {
    this.showMessages = true;
  }

  // Show tweets when any other button is clicked, like "Home"
  showTweetsComponent() {
    this.showMessages = false;
  }
}
