import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  companyInfo = {
    name: 'VoyageConnect',
    founded: 2023,
    mission: 'To connect travelers with unforgettable experiences around the world.',
    vision: 'To become the leading platform for personalized and sustainable travel experiences.'
  };

  teamMembers = [
    { name: 'John Doe', role: 'CEO & Founder' },
    { name: 'Jane Smith', role: 'CTO' },
    { name: 'Mike Johnson', role: 'Head of Customer Experience' },
    { name: 'Sarah Brown', role: 'Lead Travel Curator' }
  ];
}

