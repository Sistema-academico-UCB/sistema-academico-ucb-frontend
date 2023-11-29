import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  showPassword = false;
  email = '';
  password = '';
  @ViewChild('errorMessage') errorMessage: any;

  constructor(private userService: UserService, private router: Router) { }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.userService.postLogin(this.email, this.password).subscribe(
      (response: any) => {
        console.log(response);
        if(response.success) {
          const token = response.data.token;
          const rol = this.getRol(token).toUpperCase();
          if(rol != "ADMIN"){
            localStorage.setItem('token', token);
            window.location.href = '/profile';
          } else {
            localStorage.setItem('token', token);
            window.location.href = '/admin-menu';
          }
        } else {
          this.errorMessage.nativeElement.classList.add('show');
          setTimeout(() => {
            this.errorMessage.nativeElement.classList.remove('show');
          }, 2000);
        }
      }
    );
  }

  getRol(token: string) {
    try {
      const payload: any = jwt_decode.default(token);
      if (payload && payload.rol) {
        return payload.rol;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al decodificar el token JWT', error);
      return null;
    }
  }

}
