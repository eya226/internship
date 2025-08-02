// src/app/modify-dialog/modify-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockOT } from '../stockage-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modify-dialog',
  template: `
    <div class="dialog-container">
      <h2>Modifier l'enregistrement</h2>
      <div class="dialog-content">
        <form [formGroup]="modifyForm">
          <div class="form-group">
            <label>Code Complet</label>
            <input type="text" formControlName="codeComplet" readonly>
          </div>
          
          <div class="form-group">
            <label>Emplacement</label>
            <input type="text" formControlName="emplacement" required>
            <div *ngIf="modifyForm.get('emplacement')?.invalid && modifyForm.get('emplacement')?.touched" class="error-message">
              Ce champ est obligatoire
            </div>
          </div>

          <div class="form-group">
            <label>Station</label>
            <select formControlName="station" required>
              <option value="STATION_1">Station 1</option>
              <option value="STATION_2">Station 2</option>
              <option value="DELIVERED">Livré</option>
            </select>
            <div *ngIf="modifyForm.get('station')?.invalid && modifyForm.get('station')?.touched" class="error-message">
              Ce champ est obligatoire
            </div>
          </div>
        </form>
      </div>
      <div class="dialog-actions">
        <button class="btn btn-cancel" (click)="onCancel()">Annuler</button>
        <button class="btn btn-save" (click)="onSave()" [disabled]="modifyForm.invalid">Enregistrer</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      max-width: 500px;
    }
    .dialog-content {
      padding: 20px 0;
    }
    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      margin-bottom: 4px;
    }
    input, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .error-message {
      color: #d93025;
      font-size: 14px;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-cancel {
      background: #f0f0f0;
    }
    .btn-save {
      background: #2196F3;
      color: white;
    }
    .btn-save:disabled {
      background: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class ModifyDialogComponent {
  modifyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModifyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StockOT
  ) {
    this.modifyForm = this.fb.group({
      codeComplet: [data.codeComplet || ''],
      emplacement: [data.emplacement || '', Validators.required],
      station: [data.station || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.modifyForm.valid) {
      const updatedData = {
        ...this.data,
        ...this.modifyForm.value
      };
      this.dialogRef.close(updatedData);
    }
  }
}