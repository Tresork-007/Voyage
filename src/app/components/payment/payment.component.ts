import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../../services/reservation.service';
import { PaymentService } from '../../services/payment.service';
import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  reservation: Reservation | null = null;
  paymentForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private paymentService: PaymentService
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
      cardholderName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const reservationId = this.route.snapshot.queryParamMap.get('reservationId');
    if (reservationId) {
      this.loadReservation(+reservationId);
    } else {
      this.router.navigate(['/']);
    }
  }

  loadReservation(id: number): void {
    this.reservationService.getReservation(id).subscribe(
      (reservation) => {
        this.reservation = reservation;
      },
      (error) => {
        this.error = 'Error loading reservation. Please try again later.';
        console.error('Error loading reservation', error);
      }
    );
  }

  onSubmit(): void {
    if (this.paymentForm.valid && this.reservation) {
      this.loading = true;
      const payment = {
        reservation: this.reservation,
        amount: this.reservation.totalPrice,
        paymentDate: new Date(),
        paymentMethod: 'Credit Card',
        status: 'PENDING'
      };

      this.paymentService.createPayment(payment).subscribe(
        (createdPayment) => {
          this.loading = false;
          // Navigate to a confirmation page or show a success message
          this.router.navigate(['/payment-confirmation'], { queryParams: { paymentId: createdPayment.id } });
        },
        (error) => {
          this.loading = false;
          this.error = 'Error processing payment. Please try again later.';
          console.error('Error processing payment', error);
        }
      );
    }
  }
}

