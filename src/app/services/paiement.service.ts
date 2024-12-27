import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../Models/Payment';
import {ENVIRONMENT} from "../Shared/environement";

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${ENVIRONMENT.apiUrl}payments`;

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
   * Récupère tous les paiements
   */
  getAllPayments(): Observable<Payment[]> {
    const headers = this.createHeaders();
    return this.http.get<Payment[]>(this.apiUrl,{headers});
  }

  /**
   * Récupère un paiement par son ID
   * @param id ID du paiement
   */
  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée un nouveau paiement
   * @param payment Objet paiement à créer
   */
  savePayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment,{headers: {'Content-Type': 'application/json'}});
  }

  /**
   * Met à jour un le status paiement existant
   */
  updatePaymentStatus(id: number | undefined, status: string): Observable<Payment> {
  console.log(`Updating payment status: ID=${id}, Status=${status}`);
  return this.http.patch<Payment>(`${this.apiUrl}/${id}/status`,
    { status },
    { headers: { 'Content-Type': 'application/json' } }
  );
}

  /**
   * Supprime un paiement par son ID
   * @param id ID du paiement
   */
  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère les paiements par type de service
   * @param serviceType Type de service
   */
  getPaymentsByServiceType(serviceType: string): Observable<Payment[]> {
    const params = new HttpParams().set('serviceType', serviceType);
    return this.http.get<Payment[]>(`${this.apiUrl}/by-service-type`, { params });
  }

  /**
   * Récupère les paiements dans une plage de dates
   * @param startDate Date de début
   * @param endDate Date de fin
   */
  getPaymentsWithinDateRange(startDate: string, endDate: string): Observable<Payment[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Payment[]>(`${this.apiUrl}/by-date-range`, { params });
  }

  /**
   * Récupère les paiements par client
   * @param clientId ID du client
   */
  getPaymentsByClient(clientId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/by-client/${clientId}`);
  }
}
