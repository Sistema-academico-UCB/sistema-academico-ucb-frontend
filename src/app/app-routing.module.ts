import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { AddTeacherComponent } from './components/add-teacher/add-teacher.component';
import { ProfileTeacherInfoComponent } from './components/profile-teacher-info/profile-teacher-info.component';
import { ProfileTeacherEditComponent } from './components/profile-teacher-edit/profile-teacher-edit.component';
import { ProfileTeacherComponent } from './components/profile-teacher/profile-teacher.component';





const routes: Routes = [
  { path: 'add-student', component: AddStudentComponent },
  { path: 'add-teacher', component: AddTeacherComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile-info', component: ProfileInfoComponent },
  { path: 'profile-edit', component: ProfileEditComponent },
  { path: 'profile-teacher', component: ProfileTeacherComponent },
  { path: 'profile-teacher-info', component: ProfileTeacherInfoComponent },
  { path: 'profile-teacher-edit', component: ProfileTeacherEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
