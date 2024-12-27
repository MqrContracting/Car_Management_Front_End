import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import Transaction from "../Models/Transaction";
import {ENVIRONMENT} from "../Shared/environement";

@Injectable({
  providedIn: 'root',

})
export class TransactionService {
  private readonly basePath = `${ENVIRONMENT.apiUrl}transactions`;    // URL du backend

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
   * Crée une nouvelle transaction.
   * @param transaction Les données de la transaction.
   * @returns L'objet de la transaction sauvegardée.
   */
  saveTransaction(transaction: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(`${this.basePath}`, transaction, { headers });
  }

  /**
   * Récupère toutes les transactions.
   * @returns Une liste de transactions.
   */
  getAllTransactions(): Observable<Transaction[]> {

    const headers = this.createHeaders();
    return this.http.get<Transaction[]>(`${this.basePath}`, { headers });
  }

  /**
   * Récupère une transaction par ID.
   * @param id L'ID de la transaction.
   * @returns La transaction correspondante.
   */
  getTransactionById(id: number): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get<any>(`${this.basePath}/${id}`, { headers });
  }

  /**
   * Récupère les transactions par numéro de registre de voiture.
   * @param regNo Le numéro de registre.
   * @returns Une liste de transactions correspondantes.
   */
  getTransactionsByCarRegNo(regNo: string): Observable<any[]> {
    const params = new HttpParams().set('regNo', regNo);
    const headers = this.createHeaders();
    return this.http.get<any[]>(`${this.basePath}/search-by-regno`, { headers, params });
  }

  /**
   * Récupère les transactions par type de service.
   * @param serviceType Le type de service.
   * @returns Une liste de transactions correspondantes.
   */
  getTransactionsByServiceType(serviceType: string): Observable<any[]> {
    const params = new HttpParams().set('serviceType', serviceType);
    const headers = this.createHeaders();
    return this.http.get<any[]>(`${this.basePath}/search-by-service-type`, { headers, params });
  }

  /**
   * Récupère les transactions dans une plage de dates.
   * @param startDate La date de début (format ISO).
   * @param endDate La date de fin (format ISO).
   * @returns Une liste de transactions correspondantes.
   */
  getTransactionsWithinDateRange(startDate: string, endDate: string): Observable<any[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    const headers = this.createHeaders();
    return this.http.get<any[]>(`${this.basePath}/search-by-date-range`, { headers, params });
  }

  /**
   * Supprime une transaction par ID.
   * @param id L'ID de la transaction.
   * @returns Une réponse vide (void).
   */
  deleteTransaction(id: number): Observable<void> {
    const headers = this.createHeaders();
    return this.http.delete<void>(`${this.basePath}/${id}`, { headers });
  }
}
