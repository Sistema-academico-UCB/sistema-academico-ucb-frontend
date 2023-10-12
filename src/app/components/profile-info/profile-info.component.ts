import { Component } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { StudentService } from 'src/app/service/student.service';
import { UserDto } from 'src/app/dto/user.dto';


@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent {
  constructor(private userService: UserService, private StudentService: StudentService) {
  }

  user: UserDto = {} as UserDto;
  friendsList: UserDto[] = []; 
  countFriends: number = 0;

  ngOnInit(){
    console.log("Obteniendo información del usuario");
    this.userService.getUserInfo()
    .subscribe({
      next:data => {
        console.log(data.data);
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
        this.user.username = data.data.username;
        this.user.nombre = data.data.nombre;
        this.user.apellidoPaterno = data.data.apellidoPaterno;
        this.user.apellidoMaterno = data.data.apellidoMaterno;
        this.user.rol = data.data.rol;
        this.user.correo = data.data.correo;
        this.user.descripcion = data.data.descripcion;
        this.user.fechaRegistro = this.formattedDate(data.data.fechaRegistro);
      },
      error: (error) => console.log(error),
    });

    this.userService.getFriends().subscribe(
      (data: any) => {
        this.friendsList = data.data;
        this.countFriends = this.friendsList.length;
        console.log(data);
      }
    );
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
}
