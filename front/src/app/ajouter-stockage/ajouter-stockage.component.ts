
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StockageServiceService } from '../stockage-service.service';

@Component({
  selector: 'app-ajouter-stockage',
  templateUrl: './ajouter-stockage.component.html',
  styleUrls: ['./ajouter-stockage.component.css']
})
export class AjouterStockageComponent implements OnInit {
  stockForm!: FormGroup;
  isLoading = false;
  duplicateMessage: string = '';
  duplicateFound: boolean = false;

  constructor(
    private fb: FormBuilder,
    private stockageService: StockageServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.stockForm = this.fb.group({
      codeComplet: ['', [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(14)
      ]],
      emplacement: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      station: ['', Validators.required]
    });

    // Watch for changes
    this.stockForm.get('codeComplet')?.valueChanges.subscribe(value => {
      if (value && value.length === 14) {
        this.checkDuplicate(value);
      }
    });
  }

  get f() {
    return this.stockForm.controls;
  }

  checkDuplicate(code: string): void {
    this.stockageService.checkDuplicate(code).subscribe({
      next: (res) => {
        this.duplicateFound = res.exists;
        this.duplicateMessage = res.exists 
          ? '⚠️ Ce code plan existe déjà.' 
          : '';
      },
      error: (err) => {
        console.error('Error checking duplicate:', err);
        this.duplicateMessage = 'Erreur lors de la vérification des doublons';
      }
    });
  }

  onSubmit(): void {
    if (this.stockForm.invalid || this.duplicateFound) {
      this.stockForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = {
      CodeComplet: this.stockForm.value.codeComplet,
      Emplacement: this.stockForm.value.emplacement,
      Station: this.stockForm.value.station
    };

    this.stockageService.addStockOT(formData).subscribe({
      next: () => {
        this.router.navigate(['/secure/liste']);
      },
      error: (err) => {
        console.error('Error adding stock:', err);
        this.isLoading = false;
        alert('Échec de l\'enregistrement: ' + (err.message || 'Erreur inconnue'));
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
