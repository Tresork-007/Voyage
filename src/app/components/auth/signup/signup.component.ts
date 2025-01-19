import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm!: FormGroup;
  loading = false;
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

  private initForm(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private resetForm(): void {
    this.signupForm.reset();
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.setErrors(null);
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';
      
      const signupData = {
        username: this.signupForm.get('username')?.value,
        email: this.signupForm.get('email')?.value,
        password: this.signupForm.get('password')?.value
      };

      console.log('Données envoyées:', signupData);

      this.authService.signup(signupData).subscribe({
        next: (response) => {
          console.log('Réponse succès:', response);
          this.loading = false;
          this.success = 'Inscription réussie ! Redirection vers la page de connexion...';
          this.resetForm();
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: HttpErrorResponse) => {
          console.log('Erreur complète:', error);
          this.loading = false;
          
          if (error.error === 'OK' || error.status === 200) {
            this.success = 'Inscription réussie ! Redirection vers la page de connexion...';
            this.resetForm();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            if (error.status === 400) {
              if (error.error?.message) {
                this.error = error.error.message;
              } else if (error.error?.email) {
                this.error = 'Cet email est déjà utilisé';
              } else if (error.error?.username) {
                this.error = 'Ce nom d\'utilisateur est déjà utilisé';
              } else {
                this.error = 'Les données fournies sont invalides';
              }
            } else if (error.status === 409) {
              this.error = 'Cet utilisateur existe déjà';
            } else if (error.status === 0) {
              this.error = 'Impossible de contacter le serveur';
            } else {
              this.error = 'Une erreur est survenue lors de l\'inscription';
            }
            console.error('Erreur d\'inscription:', {
              status: error.status,
              message: error.message,
              error: error.error
            });
          }
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}

