import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRenameDialogComponent } from './data-rename-dialog.component';

describe('DataRenameDialogComponent', () => {
  let component: DataRenameDialogComponent;
  let fixture: ComponentFixture<DataRenameDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataRenameDialogComponent]
    });
    fixture = TestBed.createComponent(DataRenameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
