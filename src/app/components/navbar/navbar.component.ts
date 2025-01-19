import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [`
    nav, .navbar {
      background-color: #1e3a8a !important; /* Bleu plus doux */
    }
    .navbar-brand, .nav-link {
      color: #f3f4f6 !important; /* Blanc cassé */
    }
    .btn-primary {
      background-color: #f59e0b !important; /* Orange plus doux */
      border-color: #f59e0b !important;
      color: white !important;
    }
    .btn-outline-primary {
      color: #f59e0b !important;
      border-color: #f59e0b !important;
    }
    .btn-outline-primary:hover {
      background-color: #f59e0b !important;
      color: white !important;
    }
    .nav-link:hover {
      color: #fbbf24 !important; /* Orange clair au hover */
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
} 