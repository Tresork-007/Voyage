import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  reviewForm: FormGroup;
  destinationId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.reviewForm = this.fb.group({
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.destinationId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onSubmit() {
    if (this.reviewForm.valid && this.destinationId) {
      // Here you would typically send the review data to your backend
      console.log({
        destinationId: this.destinationId,
        ...this.reviewForm.value
      });
      this.snackBar.open('Thank you for your review!', 'Close', {
        duration: 3000
      });
      this.reviewForm.reset();
    }
  }
}

