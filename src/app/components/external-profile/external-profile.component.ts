import { Component } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDto } from 'src/app/dto/user.dto';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-external-profile',
  templateUrl: './external-profile.component.html',
  styleUrls: ['./external-profile.component.css']
})

export class ExternalProfileComponent {
  
  id: string | null;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router) {
    const rol = localStorage.getItem('rol');
    if(rol == 'ADMIN') {
      window.alert('No tienes permisos para acceder a esta página');
      this.router.navigate(['/admin-menu']);
    } else if (rol == 'DOCENTE' || rol == 'ESTUDIANTE') {
      this.route.params.subscribe(params => {
        this.id = params['user'];
      });
      const token = localStorage.getItem('token');
      if (token) {
        const sub = this.getSub(token).toUpperCase();
        if (sub == this.id) {
          this.router.navigate(['/profile']);
        }
      }
    } else {
      window.alert('No has iniciado sesión');
      this.router.navigate(['/login']);
    }
  }

  getSub(token: string) {
    try {
      const payload: any = jwt_decode.default(token);
      if (payload && payload.sub) {
        return payload.sub;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al decodificar el token JWT', error);
      return null;
    }
  }

  user: UserDto = {} as UserDto;
  friendsList: UserDto[] = []; 
  countFriends: number = 0;
  typeFriend: number = 0;
  name: string = '';
  uuidFoto: string = '';
  firstOption: boolean = true;

  ngOnInit(){
    const nameLocal = localStorage.getItem('name');
    if (nameLocal) {
      this.name = nameLocal;
    }
    const uuidFotoLocal = localStorage.getItem('uuidFoto');
    if (uuidFotoLocal) {
      this.uuidFoto = uuidFotoLocal;
    }
    if (this.id != null) {
      this.userService.getOtherUserInfo(this.id).subscribe(
        (data: any) => {
          console.log(data);
          if (data.data.uuidFoto != ''){
            this.user.uuidFoto = data.data.uuidFoto;
          } else {
            this.user.uuidFoto = '../../../assets/icons/usuario.png';
          }
          if (data.data.uuidPortada != ''){
            this.user.uuidPortada = data.data.uuidPortada;
          } else {
            this.user.uuidPortada = '../../../assets/icons/portada-arboles.jpg';
          }
          this.user.userId = data.data.userId;
          this.user.username = data.data.username;
          this.user.nombre = data.data.nombre;
          this.user.apellidoPaterno = data.data.apellidoPaterno;
          this.user.apellidoMaterno = data.data.apellidoMaterno;
          this.user.rol = data.data.rol;
          this.user.correo = data.data.correo;
          this.user.descripcion = data.data.descripcion;
          this.user.genero = data.data.genero;
          this.user.fechaRegistro = this.formattedDate(data.data.fechaRegistro);
          this.userService.getFriends(this.user.userId).subscribe(
            (data: any) => {
              this.friendsList = data.data;
              this.countFriends = this.friendsList.length;
              console.log(data);
            }
          );
        }
      );
      this.userService.getFriendStatus(this.id).subscribe(
        (data: any) => {
          console.log(data);
          this.typeFriend = data.data;
        });
    }
  }

  public formattedDate(originalDate: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const date = new Date(originalDate);
    return date.toLocaleDateString('es-ES', options);
  }

  public addFriend() {
    if(this.id != null){
      this.userService.addFriend(this.id).subscribe(
        (data: any) => {
          console.log(data);
          this.typeFriend = 3;
        }
      );
    }
  }

  firstOptionChange() {
    this.firstOption = !this.firstOption;
  }
}
