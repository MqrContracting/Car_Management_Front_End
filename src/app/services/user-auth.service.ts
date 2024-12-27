import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private apiUrl = 'http://localhost:8080/auth';  // Backend API URL

  constructor(private http: HttpClient) { }

  // Utility method to get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Utility method to store token in localStorage
  setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  // Utility method to remove token from localStorage (Logout)
  private removeToken(): void {
    localStorage.removeItem('jwt_token');
  }

  // Register a new user
  addNewUser(userInfo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addNewUser`, userInfo);
  }

  // Authenticate and get token
  generateToken(authRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generateToken`, authRequest, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  // Store token after successful login
  login(authRequest: any): Observable<any> {
    return this.generateToken(authRequest).pipe(
      map(response => {
        if (response && response.token) {
          this.setToken(response.token); // Store token on successful login
        }
        return response;
      })
    );
  }

  // Get all users (requires token)
  getAllUsers(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/user`, { headers });
  }

  // Get user profile (requires token)
  getUserProfile(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/user/userProfile`, { headers });
  }

  // Logout (remove token from localStorage)
  logout(): void {
    this.removeToken();
  }
}
