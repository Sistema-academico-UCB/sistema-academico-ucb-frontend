import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EmailDto } from 'src/app/dto/email.dto';
import { UserService } from 'src/app/service/user.service';

interface Codigo {
  correo: string;
  codigo: string;
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  step: number = 1;
  @ViewChild('errorMessage') errorMessage: any;
  loadingFlag: boolean = false;

  constructor(private router: Router, private userService: UserService) { }

  /*--------------------- Step 1 ---------------------*/
  email = '';

  confirmarCorreo() {
    this.loadingFlag = true;
    this.userService.verifyEmail(this.email).subscribe(
      (data: any) => {
        this.loadingFlag = false;
        if (data.data) {
          this.step = 2;
          this.enviarCodigo();
        } else {
          this.errorMessage.nativeElement.classList.add('show');
          setTimeout(() => {
            this.errorMessage.nativeElement.classList.remove('show');
          }, 3000);
        }
      }
    );
  }

  /*--------------------- Step 2 ---------------------*/
  codigo: Codigo[] = [];
  code: string = '';

  enviarCodigo() {
    // Generar un codigo aleatorio (5 caracteres) y guardarlo en la variable
    const codigo = Math.random().toString(36).substring(2, 7);
    const email: EmailDto = {
      from: 'sistema.academico.ucb@gmail.com',
      to: this.email,
      subject: 'Cambio de contraseña',
      text: 'Su código de verificación es: ' + codigo + ', este código expirará en 1 minuto.'
    }
    if(this.codigo.find(element => element.correo === this.email)) {
      this.codigo.find(element => element.correo === this.email)!.codigo = codigo;
    } else {
      this.codigo.push({correo: this.email, codigo: codigo});
    }
    this.userService.sendEmail(email).subscribe(
      (data: any) => {
        console.log(data);
        this.tiempoValido();
      }
    );
  }

  tiempoValido() {
    setTimeout(() => {
      this.codigo.forEach(element => {
        if (element.correo === this.email) {
          element.codigo = '';
        }
      });
    }, 60000);
  }

  confirmarCodigo() {
    this.loadingFlag = true;
    const codeActual = this.codigo.find(element => element.correo === this.email);
    console.log(codeActual);
    if (codeActual?.codigo == '') {
      this.loadingFlag = false;
      this.errorMessage.nativeElement.classList.add('show');
      setTimeout(() => {
        this.errorMessage.nativeElement.classList.remove('show');
      }, 3000);
    } else {
      if (codeActual?.codigo == this.code) {
        this.loadingFlag = false;
        this.step = 3;
      } else {
        this.loadingFlag = false;
        this.errorMessage.nativeElement.classList.add('show');
        setTimeout(() => {
          this.errorMessage.nativeElement.classList.remove('show');
        }, 3000);
      }
    }
  }

  /*--------------------- Step 3 ---------------------*/
  showPassword = false;
  password = '';
  @ViewChild('confirmMessage') confirmMessage: any;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  confirmarCambio() {
    this.loadingFlag = true;
    const body = {
      'email': this.email,
      'newPassword': this.password
    }
    this.userService.changePassword(body).subscribe(
      (data: any) => {
        console.log(data);
        if(data.success) {
          this.loadingFlag = false;
          this.confirmMessage.nativeElement.classList.add('show');
          setTimeout(() => {
            this.confirmMessage.nativeElement.classList.remove('show');
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.loadingFlag = false;
          this.errorMessage.nativeElement.classList.add('show');
          setTimeout(() => {
            this.errorMessage.nativeElement.classList.remove('show');
            this.router.navigate(['/login']);
          }, 3000);
        }
      }
    );
  }

  cancelar() {
    this.router.navigate(['/login']);
  }

}
