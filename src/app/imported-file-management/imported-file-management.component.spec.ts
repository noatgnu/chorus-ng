import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedFileManagementComponent } from './imported-file-management.component';

describe('ImportedFileManagementComponent', () => {
  let component: ImportedFileManagementComponent;
  let fixture: ComponentFixture<ImportedFileManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportedFileManagementComponent]
    });
    fixture = TestBed.createComponent(ImportedFileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
