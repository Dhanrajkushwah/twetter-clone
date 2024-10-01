import { Component, OnInit } from '@angular/core';
import { TweetService } from '../tweet.service';
import { UserserviceService } from '../userservice.service';
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

  constructor(private tweetService: TweetService,private authService: UserserviceService) {}

  onTweet() {
    const newTweet: Tweet = {
      content: this.content,
      mediaUrl: this.mediaUrl,
      author: this.currentUser
    };

    this.tweetService.createTweet(newTweet).subscribe(response => {
      console.log('Tweet created:', response);
      this.Gettweet(); 
      
    });
  }

  ngOnInit() {
   this.Gettweet()
   this.currentUser = this.authService.getCurrentUser();
  }
  Gettweet(){
    this.tweetService.getTweets().subscribe((tweets: any) => {
      this.tweets = tweets;
      console.log("Tweet",this.tweets)
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

    this.tweetService.likeTweet(tweetId).subscribe((updatedTweet: Tweet) => {
      const index = this.tweets.findIndex(tweet => tweet._id === tweetId);
      if (index !== -1) {
        this.tweets[index] = updatedTweet; // Update the tweet with the new like count
      }
    });
  }
  
}