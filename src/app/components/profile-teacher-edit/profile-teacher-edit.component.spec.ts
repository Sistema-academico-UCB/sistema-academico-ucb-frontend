import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTeacherEditComponent } from './profile-teacher-edit.component';

describe('ProfileTeacherEditComponent', () => {
  let component: ProfileTeacherEditComponent;
  let fixture: ComponentFixture<ProfileTeacherEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileTeacherEditComponent]
    });
    fixture = TestBed.createComponent(ProfileTeacherEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
