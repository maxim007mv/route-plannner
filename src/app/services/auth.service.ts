import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user';
import { Route } from '../models/route';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // URL вашего бэкенда
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadUserFromToken();
  }

  private loadUserFromToken() {
    if (this.isBrowser) {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        this.validateToken(token).subscribe({
          next: (user) => this.currentUserSubject.next(user),
          error: () => this.logout()
        });
      }
    }
  }

  register(userData: {
    email: string;
    password: string;
    name: string;
  }): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData, {
      withCredentials: false
    }).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        this.currentUserSubject.next(response.user);
      }),
      map(response => response.user)
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }, {
      withCredentials: false
    }).pipe(
      tap(response => {
        if (this.isBrowser) {
          localStorage.setItem(this.tokenKey, response.token);
        }
        this.currentUserSubject.next(response.user);
      }),
      map(response => response.user)
    );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/profile`, userData, {
      headers: new HttpHeaders(this.getAuthHeaders())
    }).pipe(
      tap(updatedUser => this.currentUserSubject.next(updatedUser))
    );
  }

  saveRoute(route: Route): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/routes`, route, {
      headers: new HttpHeaders(this.getAuthHeaders())
    }).pipe(
      tap(updatedUser => this.currentUserSubject.next(updatedUser))
    );
  }

  private getAuthHeaders(): { [key: string]: string } {
    if (this.isBrowser) {
      const token = localStorage.getItem(this.tokenKey);
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
    return {};
  }

  private validateToken(token: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/validate-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Метод для обновления данных пользователя
  updateUserData(userData: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      if (this.isBrowser) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      this.currentUserSubject.next(updatedUser);
    }
  }
}
