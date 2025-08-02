import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheStockageComponent } from './recherche-stockage.component';

describe('RechercheStockageComponent', () => {
  let component: RechercheStockageComponent;
  let fixture: ComponentFixture<RechercheStockageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechercheStockageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechercheStockageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
