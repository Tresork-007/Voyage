import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Destination } from '../../../models/destination.model';
import { DestinationService } from '../../../services/destination.service';

@Component({
  selector: 'app-destination-detail',
  templateUrl: './destination-detail.component.html',
  styleUrls: ['./destination-detail.component.css']
})
export class DestinationDetailComponent implements OnInit {
  destination: Destination | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destinationService: DestinationService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDestination(+id);
    } else {
      this.router.navigate(['/destinations']);
    }
  }

  loadDestination(id: number): void {
    this.destinationService.getDestination(id).subscribe(
      (destination) => {
        this.destination = destination;
        this.loading = false;
      },
      (error) => {
        this.error = 'Error loading destination. Please try again later.';
        this.loading = false;
        console.error('Error loading destination', error);
      }
    );
  }
}

