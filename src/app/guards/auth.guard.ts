import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // Utilisateur connecté, autoriser l'accès
      return true;
    }

    // Utilisateur non connecté, rediriger vers la page de connexion avec l'URL de retour
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}

