import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface StockOT {
  id: number;
  codeOT: string;
  codeITM: string;
  codeComplet: string;
  emplacement: string;
  dateEnregistrement: string;
  station: 'STATION_1' | 'STATION_2' | 'DELIVERED';
}

export interface StockOTDto {
  CodeComplet: string;
  Emplacement: string;
  Station: 'STATION_1' | 'STATION_2' | 'DELIVERED';
}

export interface StationCount {
  station: string;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockageServiceService {
  private apiUrl = 'http://localhost:5146/api/StockOT';

  constructor(private http: HttpClient) {}

  addStockOT(stockOT: StockOTDto): Observable<any> {
    return this.http.post(this.apiUrl, stockOT).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = 'Erreur inconnue';
        if (err.status === 400) {
          errorMessage = err.error || 'Données invalides';
        } else if (err.status === 409) {
          errorMessage = 'Ce code plan existe déjà';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  checkDuplicate(codeComplet: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/check-duplicate?codeComplet=${encodeURIComponent(codeComplet)}`).pipe(
      catchError(err => {
        console.error('Erreur de vérification des doublons:', err);
        return throwError(() => new Error('Impossible de vérifier les doublons'));
      })
    );
  }

  getAllStockOTs(): Observable<StockOT[]> {
    return this.http.get<StockOT[]>(this.apiUrl).pipe(
      catchError(err => {
        console.error('Erreur de chargement:', err);
        return throwError(() => new Error('Échec du chargement'));
      })
    );
  }

  getByEmplacement(emplacement: string): Observable<StockOT[]> {
    return this.http.get<StockOT[]>(`${this.apiUrl}/by-emplacement/${encodeURIComponent(emplacement)}`).pipe(
      catchError(err => {
        console.error('Erreur de chargement:', err);
        return throwError(() => new Error('Échec du chargement des données pour cette emplacement'));
      })
    );
  }

  deleteStockOT(codeComplet: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${encodeURIComponent(codeComplet)}`).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = 'Erreur lors de la suppression';
        if (err.status === 404) {
          errorMessage = 'Enregistrement non trouvé';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updateStockOT(stockOT: StockOT): Observable<any> {
    const dto: StockOTDto = {
      CodeComplet: stockOT.codeComplet,
      Emplacement: stockOT.emplacement,
      Station: stockOT.station
    };
    return this.http.put(`${this.apiUrl}/${encodeURIComponent(stockOT.codeComplet)}`, dto).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = 'Erreur lors de la modification';
        if (err.status === 400) {
          errorMessage = 'Données invalides';
        } else if (err.status === 404) {
          errorMessage = 'Enregistrement non trouvé';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getStationCounts(): Observable<StationCount[]> {
    return this.http.get<StationCount[]>(`${this.apiUrl}/station-counts`).pipe(
      catchError(err => {
        console.error('Erreur de chargement des compteurs:', err);
        return throwError(() => new Error('Échec du chargement des statistiques'));
      })
    );
  }
}