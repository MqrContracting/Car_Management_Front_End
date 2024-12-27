import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { PaymentService } from '../../../services/paiement.service';
import { ServiceTypeService } from '../../../services/ServiceType.service';
import { Payment } from '../../../Models/Payment';
import { Service } from "../../../Models/Payment";
import { Router, RouterLink } from "@angular/router";
import { NgForOf, NgIf } from "@angular/common";
import Notiflix from "notiflix";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    FormsModule
  ],
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  services: Service[] = [];

  isSubmitting: boolean = false;

  filters = {
    regNo: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  };

  searchForm: FormGroup;

  paymentForm = this.formBuilder.group({
    car: this.formBuilder.group({
      regNo: ['', Validators.required],
      carType: ['', Validators.required],
    }),
    client: this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
    }),
    service: this.formBuilder.group({
      service_id: ['', Validators.required],
    }),
    givenPrice: [0, [Validators.required, Validators.min(1)]],
    paymentType: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    status: ['PENDING', Validators.required],
    entryTime: ['', Validators.required],
    paymentDate: [''],
    additionalDetails: [''],
    isPaidNow: ['NO'],
  });

  constructor(
    private readonly serviceTypeService: ServiceTypeService,
    private paymentService: PaymentService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.formBuilder.group({
      regNo: [''],
      dateFrom: [''],
      dateTo: [''],
      status: [''],
    });
  }

  ngOnInit(): void {
    this.fetchPayments();
    this.fetchServices();

    this.paymentForm.get('service.service_id')?.valueChanges.subscribe((serviceId) => {
      if (serviceId) {
        const amount = this.getAmount(+serviceId);
        this.paymentForm.patchValue({ price: amount });
      }
    });
  }

  // Validation personnalisée pour vérifier que l'heure d'entrée ne dépasse pas l'heure actuelle
  validateEntryTime(control: AbstractControl): ValidationErrors | null {
    const entryTime = control.value;
    if (!entryTime) {
      return null; // Pas de validation si le champ est vide
    }

    const now = new Date();
    const entryTimeDate = new Date(entryTime);

    if (entryTimeDate > now) {
      return { entryTimeInvalid: true }; // Retourne une erreur si l'heure dépasse l'heure actuelle
    }

    return null; // Pas d'erreur
  }

  fetchServices(): void {
    this.serviceTypeService
      .getAllService()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Service[]) => {
          this.services = data;
          Notiflix.Notify.success('Services fetched successfully!');
        },
        error: () => {
          Notiflix.Notify.failure('Failed to fetch services.');
        },
      });
  }

  getAmount(currentService: number): number | undefined{
    const service = this.services.find(s => s.id === currentService);
    return service ? service.price : 0;
  }



  // Méthode pour vérifier si un champ est invalide et a été touché
  isFieldInvalid(fieldName: string, formGroupName?: string): boolean {
    const control = formGroupName
      ? this.paymentForm.get(`${formGroupName}.${fieldName}`)
      : this.paymentForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  submitPayment(): void {
    if (this.paymentForm.valid && !this.isSubmitting) {
      this.isSubmitting = true; // Bloque la double soumission

      const payment: Payment = {
        car: {
          regNo: this.paymentForm.value.car?.regNo || '',
          carType: this.paymentForm.value.car?.carType || '',
        },
        client: {
          name: this.paymentForm.value.client?.name || '',
          email: this.paymentForm.value.client?.email || '',
          phoneNumber: this.paymentForm.value.client?.phoneNumber || '',
        },
        service: {
          id: Number(this.paymentForm.value.service?.service_id || 0),
          price: this.paymentForm.value.price || 0,
        },
        givenPrice: this.paymentForm.value.givenPrice || 0,
        paymentType: this.paymentForm.value.paymentType || '',
        status: this.paymentForm.value.status || 'PENDING',
        entryTime: this.paymentForm.value.entryTime || '',
        paymentDate: this.paymentForm.value.paymentDate || '',
        additionalDetails: this.paymentForm.value.additionalDetails || '',
        isPaidNow: this.paymentForm.value.isPaidNow || '',
      };

      this.paymentService
        .savePayment(payment)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            Notiflix.Notify.success('Transaction saved successfully!');
            this.resetForm();
            this.fetchPayments();
            this.closeModal();

            window.location.reload();
          },
          error: () => {
            Notiflix.Notify.failure('Failed to save transaction.');
          },
          complete: () => {
            this.isSubmitting = false;   // Réactive le bouton après la réponse
          }
        });
    } else {
      Notiflix.Notify.warning('Please fill in all required fields.');
      this.paymentForm.markAllAsTouched();
    }
  }

convertToDateString(dateString: string): string {
  const date = new Date(dateString); // Convertit la chaîne en objet Date

  // Options pour formatter la date (ex: 26 Dec 2024)
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  // Utilisation de Intl.DateTimeFormat pour formater la date
  return new Intl.DateTimeFormat('en-US', options).format(date);
}


  resetForm(): void {
    this.paymentForm.reset({ status: 'PENDING' });
  }

  fetchPayments(): void {
    this.paymentService
      .getAllPayments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Payment[]) => {
          this.payments = data;
          this.filteredPayments = data;
          Notiflix.Notify.success('Payments fetched successfully!');
        },
        error: () => {
          Notiflix.Notify.failure('Failed to fetch payments.');
        },
      });
  }

  applyFilters(): void {
    const { regNo, dateFrom, dateTo, status } = this.filters;

    this.filteredPayments = this.payments.filter((payment: Payment) => {
      const matchesRegNo = regNo ? payment.car.regNo.toLowerCase().includes(regNo.toLowerCase()) : true;
      const matchesStatus = status ? payment.status === status : true;

      const paymentDate = new Date(payment.paymentDate);
      const matchesDateFrom = dateFrom ? paymentDate >= new Date(dateFrom) : true;
      const matchesDateTo = dateTo ? paymentDate <= new Date(dateTo) : true;

      return matchesRegNo && matchesStatus && matchesDateFrom && matchesDateTo;
    });
    Notiflix.Notify.success('Filters applied!');
  }

  payAndCollect(payment: Payment): void {
    const updatedPayment = { ...payment, status: 'COMPLETED' };

    this.paymentService
      .updatePaymentStatus(updatedPayment.id, updatedPayment.status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          payment.status = updatedPayment.status;
          Notiflix.Notify.success('Payment marked as completed!');
        },
        error: () => {
          Notiflix.Notify.failure('Failed to complete payment.');
        },
      });
  }

  collect(payment: Payment): void {
    if (payment.status !== 'PENDING') {
      Notiflix.Notify.warning('Payment status must be PENDING to collect.');
      return;
    }

    const updatedPayment = { ...payment, status: 'COMPLETED' };

    this.paymentService
      .updatePaymentStatus(updatedPayment.id, updatedPayment.status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          payment.status = updatedPayment.status;
          Notiflix.Notify.success('Payment collected successfully!');
        },
        error: () => {
          Notiflix.Notify.failure('Failed to collect payment.');
        },
      });
  }

  closeModal(): void {
    const modal = document.getElementById('newTransactionModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  trackByServiceId(index: number, service: Service): number {
    return service.id;
  }

  trackByPaymentId(index: number, payment: Payment): number {
    return payment.id as number;
  }

  viewInvoice(payment: any): void {
  // Logique pour afficher le template de la facture
  console.log('Afficher la facture pour:', payment);
  // Exemple : Naviguer vers une page dédiée à la facture
  this.router.navigate(['/invoice', payment])
}


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
