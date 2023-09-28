import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDomainsComponent } from './custom-domains.component';

describe('CustomDomainsComponent', () => {
  let component: CustomDomainsComponent;
  let fixture: ComponentFixture<CustomDomainsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomDomainsComponent]
    });
    fixture = TestBed.createComponent(CustomDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
