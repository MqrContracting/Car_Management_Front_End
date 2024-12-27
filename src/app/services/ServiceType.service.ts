import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Service} from "../Models/Payment";
import {ENVIRONMENT} from "../Shared/environement";

@Injectable({
  providedIn: 'root',

})
export class ServiceTypeService {
  private readonly basePath = `${ENVIRONMENT.apiUrl}services`;    // URL du backend

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir le token JWT depuis le localStorage (ou autre méthode de stockage)
  private getAuthToken(): string | null {
    return localStorage.getItem('jwtToken'); // Vous pouvez également utiliser un autre stockage selon votre logique
  }

  // Configuration des en-têtes pour ajouter le token JWT à chaque requête
  private createHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  /**
   * Récupère toutes les transactions.
   * @returns Une liste de transactions.
   */
  getAllService(): Observable<Service[]> {

    const headers = this.createHeaders();
    return this.http.get<Service[]>(`${this.basePath}`, { headers });
  }

}
