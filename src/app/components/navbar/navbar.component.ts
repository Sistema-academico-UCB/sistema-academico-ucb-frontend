import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationDto } from 'src/app/dto/notification.dto';
import { UserService } from 'src/app/service/user.service';
import { forkJoin } from 'rxjs'; // Importa forkJoin desde 'rxjs'
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';


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
  users:any []=[];
  docente:any []=[];

  constructor(private router: Router, private userService: UserService) { }

  showOptions: boolean = false;
  logoutPopup: boolean = false;
  showNotification: boolean = false;
  notifications: NotificationDto[] = [];
  ngOnInit(){
    this.search();
  }
  
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
    // const newRoute = `${userId}/profile`;
    // this.router.navigate([newRoute]);
    window.location.href=`${userId}/profile`;
  }
  // Función para buscar personas
  search() {
    this.searchText.valueChanges.pipe(debounceTime(300)).subscribe(
      (value) => {
        const trimmedValue = value.trim();
        if (trimmedValue.length > 0) {
        console.log(value)
          this.users =[];
          this.docente =[];
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
              this.docente.map((doc:any)=>{
                this.users.push(doc);
              });
              console.log(this.users)
            }
          );
      }else{
        this.users =[];
        this.docente =[];
      }
    }
        
  )}

  postType(mensaje: String): boolean {
    let flag: boolean = false;
    if (mensaje.includes('ha comentado tu publicación.')) {
      flag = true;
    }
    return flag;
  }

}
