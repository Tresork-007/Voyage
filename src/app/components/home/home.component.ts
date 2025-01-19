import { Component, OnInit } from '@angular/core';
import { Destination } from '../../models/destination.model';
import { DestinationService } from '../../services/destination.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredDestinations: Destination[] = [];

  constructor(private destinationService: DestinationService) { }

  ngOnInit(): void {
    this.loadFeaturedDestinations();
  }

  loadFeaturedDestinations(): void {
    this.destinationService.getDestinations().subscribe(
      destinations => this.featuredDestinations = destinations.slice(0, 4),
      error => console.error('Error loading featured destinations', error)
    );
  }
}

