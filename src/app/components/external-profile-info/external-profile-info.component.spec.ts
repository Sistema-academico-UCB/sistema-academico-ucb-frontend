import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalProfileInfoComponent } from './external-profile-info.component';

describe('ExternalProfileInfoComponent', () => {
  let component: ExternalProfileInfoComponent;
  let fixture: ComponentFixture<ExternalProfileInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalProfileInfoComponent]
    });
    fixture = TestBed.createComponent(ExternalProfileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
