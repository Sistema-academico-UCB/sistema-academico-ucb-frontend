import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationDto } from 'src/app/dto/notification.dto';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Input() admin: boolean;
  @Input() user: boolean;

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
}
