import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationDto } from 'src/app/dto/notification.dto';
import { UserService } from 'src/app/service/user.service';
import { forkJoin } from 'rxjs'; // Importa forkJoin desde 'rxjs'
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Input() admin: boolean;
  @Input() user: boolean;
  @Input() name: string;
  @Input() uuidFoto: string;
  searchText = new FormControl();// Propiedad para almacenar la cadena de búsqueda
  users: any[] = [];
  docente: any[] = [];
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  // Controlador para el mensaje de error
  @ViewChild('errorMessage') errorMessage!: ElementRef;

  constructor(private router: Router, private userService: UserService) { }

  showOptions: boolean = false;
  logoutPopup: boolean = false;
  showNotification: boolean = false;
  showUpdatePassword: boolean = false;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorPasswordMessage: string = '';
  notifications: NotificationDto[] = [];
  confirmationPopup = false; // Popup de confirmación

  ngOnInit() {
    this.search();
  }

  logout() {
    this.logoutPopup = true;
    this.showOptions = false;
  }

  confirm() {
    const token = localStorage.getItem('token');
    console.log(token);
    localStorage.removeItem('token');
    localStorage.clear();
    window.location.href = '/login';
  }

  cancel() {
    this.logoutPopup = false;
  }

  toggleShowOldPassword() {
    this.showOldPassword = !this.showOldPassword;
  }
  toggleShowNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }
  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  showNotifications() {
    this.showNotification = !this.showNotification;
    this.showOptions = false;
    this.userService.getNotifications().subscribe(
      (data: any) => {
        this.notifications = data.data;
        console.log(data);
      }
    );
  }

  showUpdatePasswordModal() {
    this.showUpdatePassword = !this.showUpdatePassword;
    this.showOptions = false;
  }

  updatePassword() {
    // Validación de campos
    if (this.validacion()) {
      this.userService.updatePassword(this.oldPassword, this.newPassword, this.confirmPassword).subscribe(
        (data: any) => {
          if (data.success == true) {
            //Mostrar un popup de que se actualizó la contraseña
            this.confirmationPopup = true;
            this.oldPassword = '';
            this.newPassword = '';
            this.confirmPassword = '';
          } else {
            this.errorPasswordMessage = data.message;
            this.mensajeError();
          }
        }
      );

    }
  }

  responseFriend(friendId: number, response: boolean) {
    this.userService.respondFriendRequest(friendId, response).subscribe(
      (data: any) => {
        console.log(data);
      }
    );
    this.showNotification = false;
  }
  navigateToProfile(userId: number) {
    //this.router.navigate(['', userId, 'profile']);
    // const newRoute = `${userId}/profile`;
    // this.router.navigate([newRoute]);
    window.location.href = `${userId}/profile`;
  }
  // Función para buscar personas
  search() {
    this.searchText.valueChanges.pipe(debounceTime(300)).subscribe(
      (value) => {
        const trimmedValue = value.trim();
        if (trimmedValue.length > 0) {
          console.log(value)
          this.users = [];
          this.docente = [];
          this.userService.getUsers(value).subscribe(
            (data1: any) => {
              this.users = data1.data;
              console.log(this.users)
            }
          );
          this.userService.getTeachers(value).subscribe(
            (data2: any) => {
              this.docente = data2.data;
              //this.users = this.users.concat(this.docente);
              this.docente.map((doc: any) => {
                this.users.push(doc);
              });
              console.log(this.users)
            }
          );
        } else {
          this.users = [];
          this.docente = [];
        }
      }

    )
  }

  myPublication() {
    window.location.href = '/profile/3';
  }

  otherPublication(emisorId: number) {
    window.location.href = `${emisorId}/profile/3`;
  }

  /*Mensaje error*/
  mensajeError() {
    this.errorMessage.nativeElement.classList.add('warning-active');
    setTimeout(() => {
      this.errorMessage.nativeElement.classList.remove('warning-active');
    }, 2500);
  }
  /*Validacion*/
  validacion() {
    let flag = false;
    if (this.oldPassword == "") {
      this.errorPasswordMessage = 'Por favor, ingrese la contraseña actual';
      this.mensajeError();
    } else if (this.newPassword == "") {
      this.errorPasswordMessage = 'Por favor, ingrese la nueva contraseña';
      this.mensajeError();
    } else if (this.confirmPassword == "") {
      this.errorPasswordMessage = 'Por favor, ingrese la confirmación de la contraseña';
      this.mensajeError();
    } else {
      flag = true;
    }
    return flag;
  }

}
