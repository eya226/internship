import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecureRoutingModule } from './secure-routing.module';

// Protected Components
import { MenuComponent } from '../menu/menu.component';
import { RechercheStockageComponent } from '../recherche-stockage/recherche-stockage.component';
import { EnregistrementComponent } from '../enregistrement/enregistrement.component';
import { AjouterStockageComponent } from '../ajouter-stockage/ajouter-stockage.component';

// Material Modules used inside secure module
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    MenuComponent,
    RechercheStockageComponent,
    EnregistrementComponent,
    AjouterStockageComponent
  ],
  imports: [
    CommonModule,
    SecureRoutingModule,

    // Material modules used in secure pages
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSelectModule,
    MatInputModule,
    MatGridListModule,
    MatListModule,
    MatProgressSpinnerModule
  ]
})
export class SecureModule { }