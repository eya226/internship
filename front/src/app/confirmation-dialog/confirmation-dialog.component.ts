// src/app/confirmation-dialog/confirmation-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">{{ data.title }}</h2>
      <div class="dialog-content">{{ data.message }}</div>
      <div class="dialog-actions">
        <button class="btn btn-no" (click)="onNoClick()">Non</button>
        <button class="btn btn-yes" (click)="onYesClick()">Oui</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 2rem;
      background-color: var(--white);
      border-radius: 16px;
      box-shadow: 0 10px 30px var(--shadow-color);
      text-align: center;
    }
    .dialog-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--royal-blue);
      margin-bottom: 1rem;
    }
    .dialog-content {
      font-size: 1rem;
      color: #666;
      margin-bottom: 2rem;
    }
    .dialog-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(44, 62, 148, 0.2);
    }
    .btn-no {
      background: #f0f0f0;
      color: #333;
    }
    .btn-yes {
      background: var(--royal-blue);
      color: var(--white);
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string, message: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}