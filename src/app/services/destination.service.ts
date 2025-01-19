import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Destination } from '../models/destination.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.apiUrl}/destinations`);
  }

  getFeaturedDestinations(): Observable<Destination[]> {
    return this.http.get<Destination[]>(`${this.apiUrl}/destinations/featured`);
  }

  getDestination(id: number): Observable<Destination> {
    return this.http.get<Destination>(`${this.apiUrl}/destinations/${id}`);
  }

  createDestination(destination: Destination): Observable<Destination> {
    return this.http.post<Destination>(`${this.apiUrl}/destinations`, destination);
  }

  updateDestination(id: number, destination: Destination): Observable<Destination> {
    return this.http.put<Destination>(`${this.apiUrl}/destinations/${id}`, destination);
  }

  deleteDestination(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/destinations/${id}`);
  }
}

