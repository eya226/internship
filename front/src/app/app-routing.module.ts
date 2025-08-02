// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'secure',
    loadChildren: () => import('./secure/secure.module').then(m => m.SecureModule),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Changed to redirect to login
  { path: '**', redirectTo: 'login' } // Changed to redirect to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }