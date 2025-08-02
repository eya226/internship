
import { Component, OnInit } from '@angular/core';
import { StockageServiceService, StockOT } from '../stockage-service.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-recherche-stockage',
  templateUrl: './recherche-stockage.component.html',
  styleUrls: ['./recherche-stockage.component.css'],
  providers: [DatePipe]
})
export class RechercheStockageComponent implements OnInit {
  searchTerm: string = '';
  searchType: 'codeOT' | 'codeITM' | 'codeComplet' | 'emplacement' | 'station' = 'codeOT';
  stockages: StockOT[] = [];
  filteredStockages: StockOT[] = [];
  displayedStockages: StockOT[] = [];
  erreur: string = '';
  showSearchOptions = false;
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private stockageService: StockageServiceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll() {
    this.stockageService.getAllStockOTs().subscribe({
      next: (data: StockOT[]) => {
        this.stockages = data;
        this.filteredStockages = [...data];
        this.updateDisplayedItems();
      },
      error: () => {
        this.erreur = "Erreur lors du chargement des données";
      }
    });
  }

  applyFilter() {
    const term = this.searchTerm.toLowerCase();

    if (!term) {
      this.filteredStockages = [...this.stockages];
    } else {
      switch (this.searchType) {
        case 'codeOT':
          this.filteredStockages = this.stockages.filter(item =>
            item.codeOT?.toLowerCase().includes(term));
          break;
        case 'codeITM':
          this.filteredStockages = this.stockages.filter(item =>
            item.codeITM?.toLowerCase().includes(term));
          break;
        case 'codeComplet':
          this.filteredStockages = this.stockages.filter(item =>
            item.codeComplet?.toLowerCase().includes(term));
          break;
        case 'emplacement':
          this.filteredStockages = this.stockages.filter(item =>
            item.emplacement?.toLowerCase().includes(term));
          break;
        case 'station':
          this.filteredStockages = this.stockages.filter(item =>
            item.station?.toLowerCase().includes(term));
          break;
        default:
          this.filteredStockages = this.stockages.filter(item =>
            item.codeOT?.toLowerCase().includes(term) ||
            item.codeITM?.toLowerCase().includes(term) ||
            item.codeComplet?.toLowerCase().includes(term) ||
            item.emplacement?.toLowerCase().includes(term) ||
            item.station?.toLowerCase().includes(term)
          );
      }
    }

    this.currentPage = 1;
    this.updateDisplayedItems();
    this.erreur = this.filteredStockages.length === 0 ? "Aucun enregistrement trouvé." : '';
  }

  updateDisplayedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.displayedStockages = this.filteredStockages.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updateDisplayedItems();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStockages.length / this.itemsPerPage);
  }

  selectSearchType(type: 'codeOT' | 'codeITM' | 'codeComplet' | 'emplacement' | 'station') {
    this.searchType = type;
    this.showSearchOptions = false;
    this.applyFilter();
  }

  clearSearchType() {
    this.searchType = 'codeOT';
    this.searchTerm = '';
    this.applyFilter();
  }

  getSearchTypeLabel(): string {
    switch (this.searchType) {
      case 'codeOT': return 'Code OT';
      case 'codeITM': return 'Code Item';
      case 'codeComplet': return 'Code Complet';
      case 'emplacement': return 'Code Baguette';
      case 'station': return 'Station';
      default: return 'Champ de recherche';
    }
  }

  onPrintFullList() {
    this.imprimerTableau(this.stockages, 'Tableau Complet - StockageOTApp');
  }

  onPrintFiltered() {
    this.imprimerTableau(this.filteredStockages, 'Résultats Filtrés - StockageOTApp');
  }

  private imprimerTableau(data: StockOT[], titre: string) {
    const style = `
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 2cm auto;
          width: 90%;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
        }
        h2 {
          text-align: center;
        }
      </style>
    `;

    const today = this.datePipe.transform(new Date(), 'short');

    const windowContent = `
      <h2>${titre}</h2>
      <div>Date d'impression : ${today}</div>

      <table>
        <thead>
          <tr>
            <th>Code Plan</th>
            <th>Code OT</th>
            <th>Code Item</th>
            <th>Code Baguette</th>
            <th>Station</th>
            <th>Date d'Enregistrement</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(item => `
            <tr>
              <td>${item.codeComplet || '-'}</td>
              <td>${item.codeOT}</td>
              <td>${item.codeITM}</td>
              <td>${item.emplacement}</td>
              <td>${item.station}</td>
              <td>${this.datePipe.transform(item.dateEnregistrement, 'short')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const popupWin = window.open('', '_blank', 'width=800,height=600');
    if (popupWin) {
      popupWin.document.write(`
        <html>
          <head>
            <title>Impression - StockageOTApp</title>
            ${style}
          </head>
          <body onload="window.print();">
            ${windowContent}
          </body>
        </html>
      `);
      popupWin.document.close();
    }
  }
}
