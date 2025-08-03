import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface StockOT {
  codeOT: string;
  codeITM: string;
  codeComplet?: string;
  emplacement: string;
  dateEnregistrement: string;
}

@Injectable({
  providedIn: 'root'
})
export class StockageServiceService {
  private apiUrl = 'http://localhost:5146/api/StockOT';

  constructor(private http: HttpClient) {}

  getAllStockOTs(): Observable<StockOT[]> {
    return this.http.get<StockOT[]>(`${this.apiUrl}/all`).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Erreur inconnue';
        if (error.status === 401) {
          errorMessage = 'Non autorisé - Veuillez vous reconnecter';
        } else if (error.status === 404) {
          errorMessage = 'Ressource non trouvée';
        } else if (error.status >= 500) {
          errorMessage = 'Erreur serveur';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}