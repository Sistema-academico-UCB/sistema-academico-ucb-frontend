import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { AddTeacherComponent } from './components/add-teacher/add-teacher.component';
import { ListOfFriendsComponent } from './components/list-of-friends/list-of-friends.component';
import { LoginComponent } from './components/login/login.component';
import { ExternalProfileComponent } from './components/external-profile/external-profile.component';
import { ViewTeachersComponent } from './components/view-teachers/view-teachers.component';
import { ViewStudentsComponent } from './components/view-students/view-students.component';
import { StudentEditComponent } from './components/student-edit/student-edit.component';
import { TeacherEditComponent } from './components/teacher-edit/teacher-edit.component';
import { StudentReportComponent } from './components/student-report/student-report.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { AcademicSettingsComponent } from './components/academic-settings/academic-settings.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'view-students', component: ViewStudentsComponent },
  { path: 'add-student', component: AddStudentComponent },
  { path: 'view-teachers', component: ViewTeachersComponent },
  { path: 'add-teacher', component: AddTeacherComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:option', component: ProfileComponent },
  { path: 'profile-edit', component: ProfileEditComponent },
  { path: 'student-report', component: StudentReportComponent},
  { path: 'list-of-friends', component: ListOfFriendsComponent },
  { path: ':user/profile', component: ExternalProfileComponent },
  { path: ':user/profile/:option', component: ExternalProfileComponent },
  { path: 'student-edit/:student', component: StudentEditComponent},
  { path: 'teacher-edit/:teacher', component:TeacherEditComponent},
  { path: 'admin-menu', component: AdminMenuComponent},
  { path: 'academic-settings', component: AcademicSettingsComponent},
  { path: 'change-password', component: ChangePasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
