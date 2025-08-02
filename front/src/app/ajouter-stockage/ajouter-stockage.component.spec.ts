import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterStockageComponent } from './ajouter-stockage.component';

describe('AjouterStockageComponent', () => {
  let component: AjouterStockageComponent;
  let fixture: ComponentFixture<AjouterStockageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterStockageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterStockageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
