import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  usernameExistsError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['User', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.usernameExistsError = false;
      
      const { username, password, role } = this.signupForm.value;
      this.authService.signUp({ username, password, role }).subscribe({
        next: () => {
          this.isLoading = false;
          alert("Inscription réussie !");
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 409) {
            this.usernameExistsError = true;
          } else {
            alert("Erreur lors de l'inscription. Veuillez réessayer.");
          }
          console.error(error);
        }
      });
    }
  }
}