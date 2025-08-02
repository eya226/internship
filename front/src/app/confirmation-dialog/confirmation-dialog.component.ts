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
      padding: 20px;
      max-width: 350px;
    }
    .dialog-title {
      color: #d93025;
      margin-bottom: 16px;
    }
    .dialog-content {
      padding: 16px 0;
      font-size: 16px;
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
    .btn-no {
      background: #f0f0f0;
    }
    .btn-yes {
      background: #d93025;
      color: white;
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