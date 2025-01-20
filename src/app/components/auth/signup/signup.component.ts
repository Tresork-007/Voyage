import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;
  submitted = false;
  showPassword = false;
  error: string = '';
  success: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.success = '';

    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;

    const userData = {
      username: this.f['username'].value,
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.signup(userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.success = 'Inscription réussie ! Redirection vers la connexion...';
        
        // Attendre que l'utilisateur voie le message de succès
        setTimeout(() => {
          this.router.navigate(['/login'], { 
            queryParams: { 
              registered: 'success',
              email: userData.email 
            }
          });
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        console.error('Signup error:', error);

        if (error.status === 409) {
          this.error = 'Cet email ou nom d\'utilisateur est déjà utilisé';
        } else if (error.status === 400) {
          this.error = 'Données invalides. Veuillez vérifier vos informations';
        } else if (error.status === 0) {
          this.error = 'Impossible de contacter le serveur. Veuillez vérifier votre connexion internet';
        } else {
          this.error = 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer plus tard';
        }
      }
    });
  }
}
