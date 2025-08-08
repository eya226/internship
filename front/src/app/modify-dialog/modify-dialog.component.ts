// src/app/modify-dialog/modify-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockOT } from '../stockage-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modify-dialog',
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">{{ 'dialog.modify_title' | translate }}</h2>
      <div class="dialog-content">
        <form [formGroup]="modifyForm">
          <div class="form-group">
            <input type="text" formControlName="codeComplet" readonly class="form-input">
            <label class="input-label">{{ 'dialog.code_complet' | translate }}</label>
          </div>
          
          <div class="form-group">
            <input type="text" formControlName="emplacement" required class="form-input" placeholder=" ">
            <label class="input-label">{{ 'dialog.emplacement' | translate }}</label>
            <div *ngIf="modifyForm.get('emplacement')?.invalid && modifyForm.get('emplacement')?.touched" class="error-message">
              {{ 'dialog.required_field' | translate }}
            </div>
          </div>

          <div class="form-group">
            <select formControlName="station" required class="form-input">
              <option value="STATION_1">{{ 'dialog.station_1' | translate }}</option>
              <option value="STATION_2">{{ 'dialog.station_2' | translate }}</option>
              <option value="DELIVERED">{{ 'dialog.delivered' | translate }}</option>
            </select>
            <label class="input-label">{{ 'dialog.station' | translate }}</label>
            <div *ngIf="modifyForm.get('station')?.invalid && modifyForm.get('station')?.touched" class="error-message">
              {{ 'dialog.required_field' | translate }}
            </div>
          </div>
        </form>
      </div>
      <div class="dialog-actions">
        <button class="btn btn-cancel" (click)="onCancel()">{{ 'dialog.cancel' | translate }}</button>
        <button class="btn btn-save" (click)="onSave()" [disabled]="modifyForm.invalid">{{ 'dialog.save' | translate }}</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 2rem;
      background-color: var(--white);
      border-radius: 16px;
      box-shadow: 0 10px 30px var(--shadow-color);
    }
    .dialog-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--royal-blue);
      margin-bottom: 2rem;
      text-align: center;
    }
    .form-group {
      margin-bottom: 2rem;
      position: relative;
    }
    .input-label {
      position: absolute;
      top: 10px;
      left: 0;
      font-size: 1rem;
      color: #aaa;
      pointer-events: none;
      transition: all 0.3s ease;
    }
    .form-input {
      width: 100%;
      padding: 10px 0;
      border: none;
      border-bottom: 2px solid #eee;
      background: none;
      font-size: 1rem;
    }
    .form-input:focus {
      border-bottom-color: var(--royal-blue);
      outline: none;
    }
    .form-input:focus + .input-label,
    .form-input:not(:placeholder-shown) + .input-label {
      top: -20px;
      left: 0;
      font-size: 0.8rem;
      color: var(--royal-blue);
    }
    .error-message {
      color: #e74c3c;
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(44, 62, 148, 0.2);
    }
    .btn-cancel {
      background: #f0f0f0;
      color: #333;
    }
    .btn-save {
      background: var(--royal-blue);
      color: var(--white);
    }
    .btn-save:disabled {
      background: #a0c4ff;
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