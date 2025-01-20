import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;
  error: string = '';
  success: string = '';
  returnUrl: string = '/';
  backgroundImages = [
    'assets/images/bg1.jpg',
    'assets/images/bg2.jpg',
    'assets/images/bg3.jpg',
    'assets/images/bg4.jpg'
  ];
  currentImageIndex = 0;
  private imageInterval: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.initForm();
    this.handleQueryParams();
    this.startBackgroundAnimation();
    // Récupérer l'URL de retour des query params ou utiliser la page d'accueil par défaut
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnDestroy() {
    if (this.imageInterval) {
      clearInterval(this.imageInterval);
    }
  }

  private startBackgroundAnimation() {
    this.imageInterval = setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.backgroundImages.length;
    }, 5000); // Change image every 5 seconds
  }

  getCurrentBackgroundImage(): string {
    return this.backgroundImages[this.currentImageIndex];
  }

  private handleQueryParams(): void {
    const params = this.route.snapshot.queryParams;
    
    if (params['registered'] === 'success') {
      this.success = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
      if (params['email']) {
        this.loginForm.patchValue({ email: params['email'] });
      }
    }
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const email = this.f['email'].value;
    const password = this.f['password'].value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response && response.token) {
          // Stocker le token et les informations utilisateur
          this.authService.setAuthToken(response.token);
          if (response.user) {
            this.authService.setCurrentUser(response.user);
          }

          this.success = 'Connexion réussie ! Redirection...';
          
          // Rediriger vers la page précédente ou la page d'accueil
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 1500);
        } else {
          this.error = 'Réponse du serveur invalide';
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Login error:', error);
        
        if (error.status === 401) {
          this.error = 'Email ou mot de passe incorrect';
        } else if (error.status === 400) {
          this.error = 'Données de connexion invalides';
        } else if (error.status === 429) {
          this.error = 'Trop de tentatives de connexion. Veuillez réessayer plus tard';
        } else if (error.status === 0) {
          this.error = 'Impossible de contacter le serveur. Veuillez vérifier votre connexion internet';
        } else {
          this.error = 'Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard';
        }
      }
    });
  }
}
