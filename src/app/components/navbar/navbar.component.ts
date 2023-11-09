import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationDto } from 'src/app/dto/notification.dto';
import { UserService } from 'src/app/service/user.service';
import { forkJoin } from 'rxjs'; // Importa forkJoin desde 'rxjs'


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
  searchText: string = ''; // Propiedad para almacenar la cadena de búsqueda
  users:any []=[];
  docente:any []=[];

  constructor(private router: Router, private userService: UserService) { }

  showOptions: boolean = false;
  logoutPopup: boolean = false;
  showNotification: boolean = false;
  notifications: NotificationDto[] = [];
  
  logout(){
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
    const newRoute = `${userId}/profile`;
    this.router.navigate([newRoute]);
  }
  // Función para buscar personas
  search(searchText: string) {
    console.log(searchText)
    if(searchText!=''){
      this.userService.getUsers(searchText).subscribe(
        (data: any) => {
          this.users = data.data;
          console.log(this.users)
          this.userService.getTeachers(searchText).subscribe(
            (data: any) => {
              this.docente = data.data;
              this.users = this.users.concat(this.docente);
              console.log(this.users)
            }
          )
        }
      );
    }else{
      this.users =[];
    }
  }

  onInputChange() {
    console.log('Nombre a buscar', this.searchText);
    this.search(this.searchText);
  }
}
