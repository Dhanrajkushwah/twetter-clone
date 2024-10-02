import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TweetService {

  private newTweetNotification = new Subject<void>();
  constructor(private _http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token for auth
      },
    };
  }

  createTweet(tweet: { content: string; mediaUrl?: string }) {
    return this._http.post(`${environment._api}/api/user/tweets`, tweet, this.getHeaders()).pipe(
      tap(() => {
        // Notify components when a new tweet is created
        this.newTweetNotification.next();
      })
    );;
  }


  getNewTweetNotification(): Observable<void> {
    return this.newTweetNotification.asObservable();
  }
  getTweets() {
    return this._http.get(`${environment._api}/api/user/tweets`, this.getHeaders());
  }

 likeTweet(tweetId: string): Observable<any> {
  return this._http.post(`${environment._api}/api/user/tweets/${tweetId}/like`, {}, this.getHeaders()); // Ensure the body is passed even if empty ( {})
}

deleteTweet(tweetId: string): Observable<any> {
  return this._http.delete(`${environment._api}/api/user/tweets/${tweetId}`, this.getHeaders());
}

retweetTweet(tweetId: string): Observable<any> {
  return this._http.put(`${environment._api}/api/user/tweets/${tweetId}/retweet`, {}, this.getHeaders());
}

  getUserById(userId: string): Observable<any> {
    return this._http.get<any>(`${environment._api}/api/user/users/${userId}`, this.getHeaders());
  }

  // Fetch tweets of a specific user
  getUserTweets(userId: string): Observable<any> {
    return this._http.get<any>(`${environment._api}/api/user/tweets/${userId}`, this.getHeaders());
  }

  getFollowers(userId: string): Observable<any> {
    return this._http.get(`${environment._api}/api/user/users/${userId}/followers`,this.getHeaders());
  }

  // Get following users of a user
  getFollowing(userId: string): Observable<any> {
    return this._http.get(`${environment._api}/api/user/users/${userId}/following`,this.getHeaders());
  }

  // Follow a user
  followUser(currentUserId: string, followUserId: string): Observable<any> {
    return this._http.post(`${environment._api}/api/user/follow`, {
      followerId: currentUserId,
      followUserId: followUserId
    },this.getHeaders());
  }

  unfollowUser(currentUserId: string, unfollowUserId: string): Observable<any> {
    return this._http.post(`${environment._api}/api/user/unfollow`, {
      followerId: currentUserId,
      unfollowUserId: unfollowUserId
    }, this.getHeaders());
  }

  getUserProfile(userId: string): Observable<any> {
    return this._http.get(`${environment._api}/api/user/users/${userId}`,this.getHeaders());
  }
  
}
