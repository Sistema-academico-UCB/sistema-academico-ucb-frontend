import { Component } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-external-profile',
  templateUrl: './external-profile.component.html',
  styleUrls: ['./external-profile.component.css']
})
export class ExternalProfileComponent {
  constructor(private userService: UserService, private route: ActivatedRoute) {
  }
  id: string | null;
  Id: number

  user = {
    name: '',
    username: '',
    email: '',
    register: '',
    urlPfp: '../../../assets/icons/usuario.png',
    urlHeader: '../../../assets/icons/portada-arboles.jpg',
    description: '',
    carrera: '',
    rol: ''
  };
  registroDia:string=''
  registroMes:string=''
  registroYear:string=''
  ngOnInit(){
    this.id = this.route.snapshot.paramMap.get('user');
    console.log("Obteniendo información del usuario", this.id);
    this.Id = Number(this.id);
    this.userService.getOtherUserInfo(this.Id.toString())
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
        this.user.description=data.data.descripcion;
        this.registroDia=data.data.fechaRegistro.substring(8,10);
        this.registroMes=data.data.fechaRegistro.substring(5,7);
        this.registroYear=data.data.fechaRegistro.substring(0,4);
        this.user.rol = data.data.rol;
        console.log(data.data)
    },
    error: (error) => console.log(error),
  })
  }

}
