// src/app/secure/secure.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';

import { MatBadgeModule } from '@angular/material/badge';
// Components
import { EnregistrementComponent } from '../enregistrement/enregistrement.component';
import { RechercheStockageComponent } from '../recherche-stockage/recherche-stockage.component';
import { AjouterStockageComponent } from '../ajouter-stockage/ajouter-stockage.component';
import { MenuComponent } from '../menu/menu.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ModifyDialogComponent } from '../modify-dialog/modify-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { OrderByPipe } from '../pipes/order-by.pipe';
import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EnregistrementComponent,
    RechercheStockageComponent,
    AjouterStockageComponent,
    MenuComponent,
    DashboardComponent,
    ModifyDialogComponent,
    ConfirmationDialogComponent,
    OrderByPipe
  ],
  imports: [
    CommonModule,
    MatBadgeModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
    TranslateModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'menu', pathMatch: 'full' },
      { path: 'menu', component: MenuComponent },
      { path: 'enregistrement', component: EnregistrementComponent },
      { path: 'recherche', component: RechercheStockageComponent },
      { path: 'ajouter', component: AjouterStockageComponent },
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AdminGuard]
      },
      { path: '**', redirectTo: 'menu' }
    ])
  ],
  providers: [DatePipe],
  exports: [
    RouterModule,
    OrderByPipe,
    TranslateModule
  ]
})
export class SecureModule {}