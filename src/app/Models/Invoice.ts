import { Payment } from "./Payment";

export interface Invoice {
  id?: number;
  payment: Payment;
  invoiceNumber: number;
  totalAmount?: number; // Montant total
}
