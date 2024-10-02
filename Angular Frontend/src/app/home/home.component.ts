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
  tweets: any[] = [];
  filteredFollowers: any[] = [];
  filteredFollowing: any[] = [];
  filteredTweets: any[] = [];
  currentUserId: string = '';
  searchQuery: string = '';
  showMessages = false;
  loadingMore: any;
  newTweetCount: number = 0;
  notifications: any[] = [];
  constructor(private tweetService: TweetService, private router: Router, private socketService: SocketService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.currentUserId = userId;
      this.fetchFollowers();
      this.fetchFollowing();
      this.fetchTweets();
      this.tweetService.getNewTweetNotification().subscribe(() => {
        this.newTweetCount++;
        this.notifications.push('New tweet created');
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
            this.followers = response.followers || [];
            this.filteredFollowers = [...this.followers]; // Initially, set filtered followers to all
        },
        error => {
            console.error('Error fetching followers:', error);
        }
    );
  }

  fetchFollowing() {
    this.tweetService.getFollowing(this.currentUserId).subscribe(
        (response: any) => {
            this.following = response.following || [];
            this.filteredFollowing = [...this.following]; // Initially, set filtered following to all
        },
        error => {
            console.error('Error fetching following:', error);
        }
    );
  }

  fetchTweets() {
    this.tweetService.getTweets().subscribe(
        (response: any) => {
            this.tweets = response.tweets || [];
            this.filteredTweets = [...this.tweets]; // Initially, set filtered tweets to all
        },
        error => {
            console.error('Error fetching tweets:', error);
        }
    );
  }

  // Search logic
  onSearch() {
    const query = this.searchQuery.toLowerCase();
    
    // Filter followers
    this.filteredFollowers = this.followers.filter(follower => 
      follower.username.toLowerCase().includes(query)
    );

    // Filter following
    this.filteredFollowing = this.following.filter(follow => 
      follow.username.toLowerCase().includes(query)
    );

    // Filter tweets (assuming each tweet has a `content` or similar field)
    this.filteredTweets = this.tweets.filter(tweet => 
      tweet.content.toLowerCase().includes(query)
    );
  }

  followUser(followUserId: string) {
    this.tweetService.followUser(this.currentUserId, followUserId).subscribe(
      response => {
        alert('Followed user successfully!');
        this.fetchFollowing();
      },
      error => {
        console.error('Error following user:', error);
        alert('Failed to follow user. Please try again.');
      }
    );
  }

  unfollowUser(unfollowUserId: string) {
    this.tweetService.unfollowUser(this.currentUserId, unfollowUserId).subscribe(
      response => {
        alert('Unfollowed user successfully!');
        this.fetchFollowing();
      },
      error => {
        console.error('Error unfollowing user:', error);
        alert('Failed to unfollow user. Please try again.');
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
  onScroll(event: any) {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight && !this.loadingMore) {
      // Load more tweets when user scrolls to bottom
    }
  }
  showMessagesComponent() {
    this.showMessages = true;
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
