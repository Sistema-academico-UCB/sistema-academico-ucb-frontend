import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTeacherInfoComponent } from './profile-teacher-info.component';

describe('ProfileTeacherInfoComponent', () => {
  let component: ProfileTeacherInfoComponent;
  let fixture: ComponentFixture<ProfileTeacherInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileTeacherInfoComponent]
    });
    fixture = TestBed.createComponent(ProfileTeacherInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
