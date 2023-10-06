import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

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
    console.log('Email: ' + this.email);
    console.log('Password: ' + this.password);
    this.userService.postLogin(this.email, this.password).subscribe(
      (response: any) => {
        if(response.success){
          this.router.navigate(['/profile']);
        } else {
          this.errorMessage.nativeElement.classList.add('show');
          setTimeout(() => {
            this.errorMessage.nativeElement.classList.remove('show');
          }, 2000);
        }
      }
    );
  }

}
