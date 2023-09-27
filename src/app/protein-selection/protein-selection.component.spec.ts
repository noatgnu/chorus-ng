import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinSelectionComponent } from './protein-selection.component';

describe('ProteinSelectionComponent', () => {
  let component: ProteinSelectionComponent;
  let fixture: ComponentFixture<ProteinSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProteinSelectionComponent]
    });
    fixture = TestBed.createComponent(ProteinSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
