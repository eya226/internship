// src/app/menu/menu.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  username: string;
  role: string;
  isAdmin: boolean;

  constructor(private authService: AuthService, private router: Router) {
    this.username = authService.getUsername();
    this.role = authService.getUserRole();
    this.isAdmin = authService.hasRole('Admin');
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}