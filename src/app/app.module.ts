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
    TeacherEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
