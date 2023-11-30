import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importar FormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { AddTeacherComponent } from './components/add-teacher/add-teacher.component';
import { HttpClientModule } from '@angular/common/http';
import { ListOfFriendsComponent } from './components/list-of-friends/list-of-friends.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { ExternalProfileComponent } from './components/external-profile/external-profile.component';
import { ViewStudentsComponent } from './components/view-students/view-students.component';
import { ViewTeachersComponent } from './components/view-teachers/view-teachers.component';
import { StudentEditComponent } from './components/student-edit/student-edit.component';
import { DatePipe } from '@angular/common';
import { TeacherEditComponent } from './components/teacher-edit/teacher-edit.component';
import { StudentReportComponent } from './components/student-report/student-report.component';
import { SharedService } from './service/shared/shared.service';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { AcademicSettingsComponent } from './components/academic-settings/academic-settings.component';
import { CareersComponent } from './components/careers/careers.component';
import { ProfessionsComponent } from './components/professions/professions.component';
import { DepartmentsComponent } from './components/departments/departments.component';


@NgModule({
  declarations: [
    AppComponent,
    AddStudentComponent,
    ProfileComponent,
    ProfileEditComponent,
    AddTeacherComponent,
    ListOfFriendsComponent,
    NavbarComponent,
    LoginComponent,
    ExternalProfileComponent,
    ViewStudentsComponent,
    ViewTeachersComponent,
    StudentEditComponent,
    TeacherEditComponent,
    StudentReportComponent,
    AdminMenuComponent,
    AcademicSettingsComponent,
    CareersComponent,
    ProfessionsComponent,
    DepartmentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe, SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
