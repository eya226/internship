
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse } from '../models/auth-response.model';
import { LoginRequest } from '../models/login-request.model';
import { SignUpRequest } from '../models/signup-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly API_URL = 'https://localhost:7036/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginRequest, rememberMe: boolean = false): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(res => {
        if (rememberMe) {
          localStorage.setItem(this.TOKEN_KEY, res.token);
        } else {
          sessionStorage.setItem(this.TOKEN_KEY, res.token);
        }
      })
    );
  }

  signUp(userData: SignUpRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/signup`, userData);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || sessionStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '';
    } catch (e) {
      console.error('Failed to decode token', e);
      return '';
    }
  }

  hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole.includes(role);
  }

  getUsername(): string {
    const token = this.getToken();
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || payload.sub || 'Utilisateur';
    } catch (e) {
      return 'Utilisateur';
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']).then(() => window.location.reload());
  }
}
