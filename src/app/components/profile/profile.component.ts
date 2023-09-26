import { Component } from '@angular/core';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(private userService: UserService) {
  }

  user = {
    name: '',
    username: '',
    email: '',
    register: '',
    urlPfp: '../../../assets/icons/usuario.png',
    urlHeader: '../../../assets/icons/portada-arboles.jpg',
    description: ''
  };
  ngOnInit(){
    console.log("Obteniendo información del usuario");
    this.userService.getUserInfo(2)
    .subscribe({
      next:data => {
        if (data.data.uuidFoto != ''){
          this.user.urlPfp = data.data.uuidFoto;
        }
        if (data.data.uuidPortada != ''){
          this.user.urlHeader = data.data.uuidPortada;
        }
        this.user.name = data.data.nombre;
        this.user.username = data.data.username;
        this.user.email = data.data.email;
        this.user.register = data.data.fechaRegistro;
        console.log(data.data)
    },
    error: (error) => console.log(error),
  })
  }
 
}
