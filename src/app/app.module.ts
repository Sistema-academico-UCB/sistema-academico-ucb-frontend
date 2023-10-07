import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { ProfileEditComponent } from './components/profile-edit/profile-edit.component';
import { AddTeacherComponent } from './components/add-teacher/add-teacher.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfileTeacherInfoComponent } from './components/profile-teacher-info/profile-teacher-info.component';
import { ProfileTeacherEditComponent } from './components/profile-teacher-edit/profile-teacher-edit.component';
import { ProfileTeacherComponent } from './components/profile-teacher/profile-teacher.component';
import { ListOfFriendsComponent } from './components/list-of-friends/list-of-friends.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { ExternalProfileComponent } from './components/external-profile/external-profile.component';
import { ExternalProfileInfoComponent } from './components/external-profile-info/external-profile-info.component';


@NgModule({
  declarations: [
    AppComponent,
    AddStudentComponent,
    ProfileComponent,
    ProfileInfoComponent,
    ProfileEditComponent,
    AddTeacherComponent,
    ProfileTeacherInfoComponent,
    ProfileTeacherEditComponent,
    ProfileTeacherComponent,
    ListOfFriendsComponent,
    NavbarComponent,
    LoginComponent,
    ExternalProfileComponent,
    ExternalProfileInfoComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
