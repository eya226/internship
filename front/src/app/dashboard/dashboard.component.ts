import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { StockageServiceService, StockOT } from '../stockage-service.service';
import { DatePipe } from '@angular/common';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DatePipe],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('pulse', [
      state('true', style({ transform: 'scale(1.05)' })),
      state('false', style({ transform: 'scale(1)' })),
      transition('false <=> true', animate('800ms ease-in-out'))
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 }))
      ])
    ]),
    trigger('expandMap', [
      state('collapsed', style({ height: '300px' })),
      state('expanded', style({ height: '500px' })),
      transition('collapsed <=> expanded', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ])
  ]
})
export class DashboardComponent implements OnInit {
  tabs: ('map' | 'bagets' | 'analytics')[] = ['map', 'bagets', 'analytics'];
  stockData: StockOT[] = [];
  filteredData: StockOT[] = [];
  selectedBaget: string | null = null;
  selectedBagetItems: StockOT[] = [];
  loading = false;
  errorMessage = '';
  movingBagets: { [key: string]: boolean } = {};
  bagetColors: { [key: string]: string } = {};
  hoveredBaget: any = null;
  tooltipPosition = { x: 0, y: 0 };
  pulseAlert = false;
  stationCounts: { station: string, count: number }[] = [];
  stuckBagets: string[] = [];
  fullBagets: string[] = [];
  bagets: { emplacement: string, station: 'STATION_1' | 'STATION_2' | 'DELIVERED', moving?: boolean }[] = [];
  activeTab: 'map' | 'bagets' | 'analytics' = 'map';
  mapExpanded = false;
  showAlertPanel = false;
  totalItems = 0;
  averageItemsPerBaget = 0;
  recentActivity: any[] = [];
  alerts: any[] = [];

  // Journey Replay
  isReplaying = false;
  replayData: StockOT[] = [];
  replayIndex = 0;
  replayInterval: any;
  replaySpeed = 500;

  // Heatmap
  stuckItems: StockOT[] = [];
  stuckItemsInterval: any;

  brandColors = {
    primary: '#005f87',
    secondary: '#00a1e0',
    accent: '#ff7d00',
    background: '#f5f9fa',
    text: '#333333',
    warning: '#e74c3c',
    lightPrimary: 'rgba(0, 95, 135, 0.08)',
    lightSecondary: 'rgba(0, 161, 224, 0.08)',
    lightAccent: 'rgba(255, 125, 0, 0.08)'
  };

  predefinedColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF'];

  constructor(
    private authService: AuthService,
    private router: Router,
    private stockageService: StockageServiceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    if (!this.authService.hasRole('Admin')) {
      this.router.navigate(['/secure/enregistrement']);
    }
    this.loadData();
    this.loadStuckItems();
    this.stuckItemsInterval = setInterval(() => this.loadStuckItems(), 30000);
    setInterval(() => this.pulseAlert = !this.pulseAlert, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.stuckItemsInterval);
  }

  loadData(): void {
    this.loading = true;
    this.stockageService.getAllStockOTs().subscribe({
      next: (data) => {
        this.stockData = data;
        this.filteredData = [...data];
        this.processData();
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Échec du chargement des données';
        this.loading = false;
      }
    });
  }

  processData(): void {
    this.totalItems = this.stockData.length;
    this.stationCounts = [
      { station: 'STATION_1', count: this.getStationCount('STATION_1') },
      { station: 'STATION_2', count: this.getStationCount('STATION_2') },
      { station: 'DELIVERED', count: this.getStationCount('DELIVERED') }
    ];

    const uniqueEmplacements = [...new Set(this.stockData.map(item => item.emplacement))];
    this.bagets = uniqueEmplacements.map(emplacement => {
      const items = this.stockData.filter(item => item.emplacement === emplacement);
      return {
        emplacement,
        station: items[0].station,
        moving: false
      };
    });

    this.averageItemsPerBaget = this.bagets.length > 0 ? 
      Math.round(this.totalItems / this.bagets.length * 10) / 10 : 0;

    this.stuckBagets = this.getStuckBagets();
    this.fullBagets = this.getFullBagets();
    this.generateAlerts();
    this.generateRecentActivity();
  }

  getBagetPosition(baget: any): { x: number, y: number } {
    if (baget.moving) {
      return baget.station === 'STATION_1' ? 
        { x: 35, y: 45 } : 
        baget.station === 'STATION_2' ?
        { x: 65, y: 45 } : 
        { x: 50, y: 45 };
    }
    
    switch (baget.station) {
      case 'STATION_1': return { x: 20, y: 30 };
      case 'STATION_2': return { x: 50, y: 60 };
      case 'DELIVERED': return { x: 80, y: 30 };
      default: return { x: 0, y: 0 };
    }
  }

  getStationCount(station: string): number {
    return this.stockData.filter(item => item.station === station).length;
  }

  getBagetCount(station: string): number {
    return this.bagets.filter(b => b.station === station && !b.moving).length;
  }

  getStationName(station: string): string {
    switch (station) {
      case 'STATION_1': return 'Station 1';
      case 'STATION_2': return 'Station 2';
      case 'DELIVERED': return 'Livré';
      default: return station;
    }
  }

  getStuckBagets(): string[] {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return [...new Set(this.stockData
      .filter(item => item.station !== 'DELIVERED' && new Date(item.dateEnregistrement) < twoDaysAgo)
      .map(item => item.emplacement))];
  }

  getFullBagets(): string[] {
    const emplacementCounts: { [key: string]: number } = {};
    this.stockData.forEach(item => {
      emplacementCounts[item.emplacement] = (emplacementCounts[item.emplacement] || 0) + 1;
    });

    return Object.entries(emplacementCounts)
      .filter(([_, count]) => count >= 10)
      .map(([emplacement]) => emplacement);
  }

  getBagetItems(emplacement: string): StockOT[] {
    return this.filteredData
      .filter(item => item.emplacement === emplacement)
      .sort((a, b) => new Date(a.dateEnregistrement).getTime() - new Date(b.dateEnregistrement).getTime());
  }

  getSelectedBagetStation(): string | null {
    if (!this.selectedBaget) return null;
    const items = this.filteredData.filter(item => item.emplacement === this.selectedBaget);
    return items.length > 0 ? items[0].station : null;
  }

  getBagetItemCount(emplacement: string): number {
    return this.filteredData.filter(item => item.emplacement === emplacement).length;
  }

  generateColor(emplacement: string): string {
    if (!this.bagetColors[emplacement]) {
      const bagetIndex = this.bagets.findIndex(b => b.emplacement === emplacement);
      this.bagetColors[emplacement] = this.predefinedColors[bagetIndex % this.predefinedColors.length];
    }
    return this.bagetColors[emplacement];
  }

  selectBaget(emplacement: string): void {
    this.selectedBaget = emplacement;
    this.selectedBagetItems = this.getBagetItems(emplacement);
    this.activeTab = 'map';
  }

  showBagetDetails(baget: any, event: MouseEvent): void {
    this.hoveredBaget = baget;
    this.tooltipPosition = {
      x: event.clientX - window.scrollX,
      y: event.clientY - window.scrollY
    };
  }

  hideBagetDetails(): void {
    this.hoveredBaget = null;
  }

  isBagetMoving(emplacement: string): boolean {
    const baget = this.bagets.find(b => b.emplacement === emplacement);
    return baget ? !!baget.moving : false;
  }

  moveToNextStation(emplacement: string): void {
    if (!emplacement) return;

    const items = this.filteredData.filter(item => item.emplacement === emplacement);
    if (items.length === 0) return;

    const bagetIndex = this.bagets.findIndex(b => b.emplacement === emplacement);
    if (bagetIndex === -1) return;

    this.bagets[bagetIndex].moving = true;
    this.movingBagets[emplacement] = true;

    setTimeout(() => {
      const currentStation = items[0].station;
      let nextStation: 'STATION_1' | 'STATION_2' | 'DELIVERED';

      switch (currentStation) {
        case 'STATION_1': nextStation = 'STATION_2'; break;
        case 'STATION_2': nextStation = 'DELIVERED'; break;
        case 'DELIVERED': nextStation = 'STATION_1'; break;
        default: return;
      }

      this.loading = true;
      
      if (currentStation === 'DELIVERED') {
        Promise.all(items.map(item =>
          this.stockageService.deleteStockOT(item.codeComplet).toPromise()
        )).then(() => {
          this.bagets[bagetIndex].station = nextStation;
          this.bagets[bagetIndex].moving = false;
          this.loadData();
          this.movingBagets[emplacement] = false;
        }).catch(() => {
          this.errorMessage = 'Échec de la suppression des articles';
          this.loading = false;
          this.bagets[bagetIndex].moving = false;
          this.movingBagets[emplacement] = false;
        });
      } else {
        const updates = items.map(item => ({
          ...item,
          station: nextStation,
          dateEnregistrement: new Date().toISOString()
        }));

        Promise.all(updates.map(item =>
          this.stockageService.updateStockOT(item).toPromise()
        )).then(() => {
          this.bagets[bagetIndex].station = nextStation;
          this.bagets[bagetIndex].moving = false;
          this.loadData();
          this.movingBagets[emplacement] = false;
        }).catch(() => {
          this.errorMessage = 'Échec de la mise à jour des articles';
          this.loading = false;
          this.bagets[bagetIndex].moving = false;
          this.movingBagets[emplacement] = false;
        });
      }
    }, 30000);
  }

  returnToStation1(emplacement: string): void {
    this.moveToNextStation(emplacement);
  }

  isItemStuck(item: StockOT): boolean {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return item.station !== 'DELIVERED' && new Date(item.dateEnregistrement) < twoDaysAgo;
  }

  toggleMapSize(): void {
    this.mapExpanded = !this.mapExpanded;
  }

  setActiveTab(tab: 'map' | 'bagets' | 'analytics'): void {
    this.activeTab = tab;
  }

  toggleAlertPanel(): void {
    this.showAlertPanel = !this.showAlertPanel;
  }

  generateAlerts(): void {
    this.alerts = [];
    
    this.stuckBagets.forEach(baget => {
      this.alerts.push({
        type: 'stuck',
        title: `Bagget ${baget} bloqué depuis plus de 2 jours`,
        content: `Le bagget ${baget} est resté dans la même station depuis plus de 2 jours sans mouvement.`,
        time: new Date()
      });
    });

    this.fullBagets.forEach(baget => {
      this.alerts.push({
        type: 'full',
        title: `Bagget ${baget} est plein`,
        content: `Le bagget ${baget} contient 10 articles ou plus et doit être traité.`,
        time: new Date()
      });
    });

    this.stationCounts.forEach(stat => {
      const utilization = (stat.count / this.totalItems) * 100;
      if (utilization > 60) {
        this.alerts.push({
          type: 'utilization',
          title: `Utilisation élevée à ${this.getStationName(stat.station)}`,
          content: `${this.getStationName(stat.station)} est à ${utilization.toFixed(0)}% de capacité.`,
          time: new Date()
        });
      }
    });

    this.alerts.sort((a, b) => b.time - a.time);
  }

  generateRecentActivity(): void {
    this.recentActivity = [];
    const recentItems = [...this.stockData]
      .sort((a, b) => new Date(b.dateEnregistrement).getTime() - new Date(a.dateEnregistrement).getTime())
      .slice(0, 5);

    recentItems.forEach(item => {
      this.recentActivity.push({
        baget: item.emplacement,
        code: item.codeComplet,
        station: this.getStationName(item.station),
        time: item.dateEnregistrement,
        action: item.station === 'DELIVERED' ? 'Livré' : 'Déplacé'
      });
    });
  }

  get alertCount(): number {
    return this.alerts.length;
  }

  getBagetClass(baget: any): string {
    if (baget.moving) {
      if (baget.station === 'STATION_1') return 'moving-to-station2';
      if (baget.station === 'STATION_2') return 'moving-to-delivered';
      if (baget.station === 'DELIVERED') return 'moving-to-station1';
    }
    return '';
  }

  exportStuckItemsAsPDF(): void {
    const doc = new jsPDF();
    const tableColumn = ["Emplacement", "Item Count", "Time in Station (min)"];
    const tableRows: any[] = [];

    this.stuckItems.forEach(item => {
      const itemData = [
        item.emplacement,
        this.getBagetItemCount(item.emplacement),
        this.getTimeInStation(item).toFixed(2)
      ];
      tableRows.push(itemData);
    });

    (doc as any).autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Stuck Items", 14, 15);
    doc.save('stuck-items.pdf');
  }

  loadStuckItems(): void {
    this.stockageService.getStuckItems().subscribe({
      next: (data: StockOT[]) => {
        this.stuckItems = data;
      },
      error: () => {
        // Handle error silently for auto-refresh
      }
    });
  }

  getUrgencyClass(item: StockOT): string {
    const minutes = this.getTimeInStation(item);
    if (minutes > 15) return 'urgency-red';
    if (minutes > 10) return 'urgency-yellow';
    return 'urgency-green';
  }

  getTimeInStation(item: StockOT): number {
    const now = new Date();
    const itemDate = new Date(item.dateEnregistrement);
    return (now.getTime() - itemDate.getTime()) / 60000;
  }

  journeyReplay(): void {
    if (!this.selectedBaget) return;

    this.stockageService.getByEmplacement(this.selectedBaget).subscribe({
      next: (data) => {
        this.replayData = data;
        this.isReplaying = true;
        this.replayIndex = 0;
        this.startReplay();
      },
      error: () => {
        this.errorMessage = 'Échec du chargement de l\'historique du bagget';
      }
    });
  }

  startReplay(): void {
    this.replayInterval = setInterval(() => {
      if (this.replayIndex < this.replayData.length) {
        const item = this.replayData[this.replayIndex];
        const baget = this.bagets.find(b => b.emplacement === item.emplacement);
        if (baget) {
          baget.station = item.station;
        }
        this.replayIndex++;
      } else {
        this.stopReplay();
      }
    }, this.replaySpeed);
  }

  pauseReplay(): void {
    clearInterval(this.replayInterval);
  }

  restartReplay(): void {
    this.stopReplay();
    this.journeyReplay();
  }

  stopReplay(): void {
    clearInterval(this.replayInterval);
    this.isReplaying = false;
    this.replayData = [];
    this.replayIndex = 0;
    this.loadData(); // Reload original data
  }

  setReplaySpeed(speed: number): void {
    this.replaySpeed = speed;
    if (this.isReplaying) {
      this.pauseReplay();
      this.startReplay();
    }
  }
}