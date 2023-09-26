import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTeacherComponent } from './profile-teacher.component';

describe('ProfileTeacherComponent', () => {
  let component: ProfileTeacherComponent;
  let fixture: ComponentFixture<ProfileTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileTeacherComponent]
    });
    fixture = TestBed.createComponent(ProfileTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
