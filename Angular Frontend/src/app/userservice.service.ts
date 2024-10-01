import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
interface Author {
  _id: string;
  username: string;
}
@Injectable({
  providedIn: 'root'
})
export class UserserviceService {
  private currentUser: Author | null = null;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor(private _http: HttpClient) {}
// userservice.service.ts

signup(obj: any): Observable<any> {
  return this._http.post<any>(`${environment._api}/api/user/users`, obj);
}

// Log in user
// userservice.service.ts
login(obj: any): Observable<any> {
  return this._http.post<any>(`${environment._api}/api/user/login`, obj).pipe(
    tap((response: any) => {
      if (response.token) {
        localStorage.setItem('token', response.token);
        this.isAuthenticatedSubject.next(true);
      }
    })
  );
}
// Log out user
logout(): void {
localStorage.removeItem('token');
this.isAuthenticatedSubject.next(false);
}
getCurrentUser(): Author {
  // Logic to return the current user
  return this.currentUser!;
}
// Get current authentication state
isLoggedIn(): boolean {
return this.isAuthenticatedSubject.getValue();
}

// Get authorization headers
getAuthHeaders(): HttpHeaders {
const token = localStorage.getItem('token');
return new HttpHeaders().set('Authorization', `Bearer ${token}`);
}

// Get token from local storage
getToken(): string | null {
return localStorage.getItem('token');
}

}
