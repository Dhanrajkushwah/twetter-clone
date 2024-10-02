import { Component, OnInit } from '@angular/core';
import { TweetService } from '../tweet.service';
import { UserserviceService } from '../userservice.service';
import Swal from 'sweetalert2';

interface Author {
  _id: string;
  username: string;
}

interface Tweet {
  _id?: string;
  content: string;
  mediaUrl?: string;
  likes?: string[];
  author?: Author; // Add the author property
}

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {
  content!: string;
  mediaUrl!: string;
  tweets: Tweet[] = [];
  currentUser!: Author;

  constructor(private tweetService: TweetService, private authService: UserserviceService) {}

  onTweet() {
    const newTweet: Tweet = {
      content: this.content,
      mediaUrl: this.mediaUrl,
      author: this.currentUser
    };

    this.tweetService.createTweet(newTweet).subscribe({
      next: (response) => {
        console.log('Tweet created:', response);
        Swal.fire({
          title: 'Success!',
          text: 'Your tweet has been created.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.Gettweet();
      },
      error: (err) => {
        console.error('Error creating tweet:', err);
        Swal.fire({
          title: 'Error!',
          text: 'There was a problem creating your tweet. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  ngOnInit() {
    this.Gettweet();
    this.currentUser = this.authService.getCurrentUser();
  }

  Gettweet() {
    this.tweetService.getTweets().subscribe((tweets: any) => {
      this.tweets = tweets;
      console.log("Tweets:", this.tweets);
    });
  }

  onFileSelected(event: Event, type: 'photo' | 'video') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'photo') {
          this.mediaUrl = e.target!.result as string; // Assigning the URL of the photo
        } else if (type === 'video') {
          this.mediaUrl = e.target!.result as string; // Assigning the URL of the video
        }
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }

  onLike(tweetId: string | undefined) {
    if (!tweetId) {
      console.error('Tweet ID is undefined!');
      return;
    }

    this.tweetService.likeTweet(tweetId).subscribe({
      next: (updatedTweet: Tweet) => {
        const index = this.tweets.findIndex(tweet => tweet._id === tweetId);
        if (index !== -1) {
          this.tweets[index] = updatedTweet; // Update the tweet with the new like count
          Swal.fire({
            title: 'Liked!',
            text: 'You have liked the tweet.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        }
      },
      error: (err) => {
        if (err.status === 400) {
          Swal.fire({
            title: 'Error!',
            text: 'Tweet already liked!',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        } else {
          console.error('Error liking tweet:', err);
          Swal.fire({
            title: 'Error!',
            text: 'There was a problem liking the tweet. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      }
    });
  }
  onDelete(tweetId: string | undefined) {
    if (!tweetId) {
      console.error('Tweet ID is undefined!');
      return;
    }
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tweetService.deleteTweet(tweetId).subscribe({
          next: () => {
            // Remove the deleted tweet from the local array
            this.tweets = this.tweets.filter(tweet => tweet._id !== tweetId);
            Swal.fire('Deleted!', 'Your tweet has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting tweet:', err);
            Swal.fire('Error!', 'There was a problem deleting the tweet.', 'error');
          }
        });
      }
    });
  }
  onRetweet(tweetId: string | undefined) {
    if (!tweetId) {
      console.error('Tweet ID is undefined!');
      return;
    }
  
    this.tweetService.retweetTweet(tweetId).subscribe({
      next: (response) => {
        console.log('Retweet successful:', response);
        Swal.fire({
          title: 'Retweeted!',
          text: 'You have retweeted the tweet.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.Gettweet(); // Refresh the tweet list to show the retweet
      },
      error: (err) => {
        console.error('Error retweeting tweet:', err);
        Swal.fire({
          title: 'Error!',
          text: 'There was a problem retweeting the tweet. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }
  
}
