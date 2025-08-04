import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn() && this.authService.hasRole('Admin')) {
      return true;
    } else {
      this.router.navigate(['/secure/menu']); // Redirect to a default secure page if not admin
      return false;
    }
  }
}
