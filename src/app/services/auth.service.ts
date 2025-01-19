import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  signup(userData: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, userData, { responseType: 'text' })
      .pipe(
        map(response => {
          if (response === 'OK') {
            return { success: true, message: 'Inscription réussie' };
          }
          return response;
        }),
        catchError(error => {
          if (error.error === 'OK') {
            return of({ success: true, message: 'Inscription réussie' });
          }
          throw error;
        })
      );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { username, password }, { responseType: 'text' })
      .pipe(
        map(response => {
          if (response) {
            try {
              const user = JSON.parse(response);
              if (user.token) {
                localStorage.setItem('token', user.token);
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
              }
              return user;
            } catch {
              // Si la réponse n'est pas du JSON valide
              if (response === 'OK') {
                return { success: true, message: 'Connexion réussie' };
              }
            }
          }
          return response;
        }),
        catchError(error => {
          if (error.error === 'OK') {
            return of({ success: true, message: 'Connexion réussie' });
          }
          throw error;
        })
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {})
      .pipe(
        map(() => {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('token');
          this.currentUserSubject.next(null);
        })
      );
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  verifyToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/verify`);
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    const currentUser = this.currentUserValue;
    return !!(token && currentUser);
  }
}

