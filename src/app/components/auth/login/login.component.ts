import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;
  error: string = '';
  success: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  get f() {
    return this.loginForm.controls;
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';

      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      console.log('Login attempt for:', username); // Pour déboguer

      this.authService.login(username, password).subscribe({
        next: (response) => {
          console.log('Login response:', response); // Pour déboguer
          this.loading = false;
          this.success = 'Connexion réussie ! Redirection...';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        },
        error: (error) => {
          console.log('Login error details:', error); // Pour déboguer
          this.loading = false;
          
          // Si l'erreur contient "OK", c'est en fait un succès
          if (error.error === 'OK' || error.status === 200 || error.error?.message === 'OK') {
            this.success = 'Connexion réussie ! Redirection...';
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);
          } else {
            // Gestion des différents cas d'erreur
            if (error.status === 401) {
              this.error = 'Nom d\'utilisateur ou mot de passe incorrect';
            } else if (error.status === 500) {
              if (error.error === 'OK') {
                this.success = 'Connexion réussie ! Redirection...';
                setTimeout(() => {
                  this.router.navigate(['/']);
                }, 1000);
              } else {
                this.error = 'Erreur serveur, veuillez réessayer plus tard';
              }
            } else {
              this.error = 'Une erreur est survenue lors de la connexion';
            }
          }
          this.submitted = false;
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}

