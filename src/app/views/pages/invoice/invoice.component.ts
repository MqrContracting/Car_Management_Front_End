import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IconComponent } from "@coreui/icons-angular";
import { PaymentService } from "../../../services/paiement.service";
import { ActivatedRoute, Router } from "@angular/router";
import Notiflix from "notiflix";
import { Payment } from "../../../Models/Payment";
import { Invoice } from "../../../Models/Invoice";

@Component({
  selector: "app-invoice-modal",
  templateUrl: "./invoice.component.html",
  styleUrls: ["invoice.component.css"],
  standalone: true,
  imports: [CommonModule, IconComponent],
})
export class InvoiceModalComponent implements OnInit {
  invoice: Invoice | undefined;

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du paiement depuis les paramètres de la route
    const paymentId = Number(this.route.snapshot.paramMap.get("id"));
    if (paymentId) {
      this.loadInvoice(paymentId);
    } else {
      Notiflix.Notify.failure("Payment ID is invalid!");
    }
  }

  loadInvoice(paymentId: number): void {
    this.paymentService.getPaymentById(paymentId).subscribe({
      next: (payment: Payment) => {
        this.invoice = {
          payment: payment,
          invoiceNumber: Math.floor(Math.random() * 100000), // Génération temporaire
          totalAmount: payment.givenPrice, // Exemple : récupérez le prix total
        };
        Notiflix.Notify.success("Payment successfully loaded");
      },
      error: (err) => {
        console.error("Error fetching payment:", err);
        Notiflix.Notify.failure("Error fetching payment details");
      },
    });
  }

  back(): void {
    this.router.navigate(["/transaction"]);
  }

  printInvoice(): void {
    window.print();
  }
}
