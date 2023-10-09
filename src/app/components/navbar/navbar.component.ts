import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Input() admin: boolean;
  @Input() user: boolean;

  constructor(private router: Router) { }

  showOptions: boolean = false;
  logoutPopup: boolean = false;
  
  logout(){
    this.logoutPopup = true;
    this.showOptions = false;
  }

  confirm() {
    const token = localStorage.getItem('token');
    console.log(token);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  cancel() {
    this.logoutPopup = false;
  }
}
