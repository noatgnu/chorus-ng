import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFilterDialogComponent } from './data-filter-dialog.component';

describe('DataFilterDialogComponent', () => {
  let component: DataFilterDialogComponent;
  let fixture: ComponentFixture<DataFilterDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataFilterDialogComponent]
    });
    fixture = TestBed.createComponent(DataFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
