import { Component, OnInit } from '@angular/core';
import { Destination } from '../../../models/destination.model';
import { DestinationService } from '../../../services/destination.service';

@Component({
  selector: 'app-destination-list',
  templateUrl: './destination-list.component.html',
  styleUrls: ['./destination-list.component.css']
})
export class DestinationListComponent implements OnInit {
  destinations: Destination[] = [];
  loading = true;
  error: string | null = null;

  constructor(private destinationService: DestinationService) { }

  ngOnInit(): void {
    this.loadDestinations();
  }

  loadDestinations(): void {
    this.destinationService.getDestinations().subscribe(
      (destinations) => {
        this.destinations = destinations;
        this.loading = false;
      },
      (error) => {
        this.error = 'Error loading destinations. Please try again later.';
        this.loading = false;
        console.error('Error loading destinations', error);
      }
    );
  }
}

