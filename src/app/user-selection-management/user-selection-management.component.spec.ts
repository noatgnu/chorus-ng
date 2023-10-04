import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectionManagementComponent } from './user-selection-management.component';

describe('UserSelectionManagementComponent', () => {
  let component: UserSelectionManagementComponent;
  let fixture: ComponentFixture<UserSelectionManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSelectionManagementComponent]
    });
    fixture = TestBed.createComponent(UserSelectionManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
