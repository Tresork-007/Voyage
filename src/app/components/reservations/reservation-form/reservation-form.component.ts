import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Destination } from '../../../models/destination.model';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss']
})
export class ReservationFormComponent implements OnInit {
  loading: boolean = false;
  error: string | null = null;
  destination: Destination | null = null;
  reservationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reservationForm = this.fb.group({
      // Ajoutez ici vos champs de formulaire
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // ... autres champs
    });
  }

  ngOnInit() {
    // Initialisez vos données ici
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      // Envoyez les données du formulaire ici
      console.log(this.reservationForm.value);
    }
  }
}
