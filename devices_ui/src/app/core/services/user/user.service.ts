import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../models/user.model';
import { LoginRequest } from '../../models/login-request.mode';
import { environment } from 'src/environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromSession());
  public user$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  setLoggedInUser(user: User) {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getLoggedInUser(): Observable<User | null> {
    return this.user$;
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('jwt_token') != null;
  }

  login (request: LoginRequest) : Observable<{token: string, user: User}> {
    return this.http.post<{token: string, user: User}>(`${environment.apiBaseUrl}/api/user/login`, request)
      .pipe(
        tap((response: { token: string; user: User; }) => {
          localStorage.setItem('jwt_token', response.token);
          this.setLoggedInUser(response.user);
        })
      );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiBaseUrl}/api/user`);
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    sessionStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  private getUserFromSession(): User | null {
    const userJson = sessionStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
