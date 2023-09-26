import { Component } from '@angular/core';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent {
  constructor(private userService: UserService) {
  }

  user = {
    name: '',
    username: '',
    email: '',
    register: '',
    urlPfp: '../../../assets/icons/usuario.png',
    urlHeader: '../../../assets/icons/portada-arboles.jpg',
    description: '',
    genero:'',
    carrea:'',
    correo:'',
    celular:'',
    fechaNacimiento:''
  };
  dia:string=''
  mes:string=''
  year:string=''
  registroDia:string=''
  registroMes:string=''
  registroYear:string=''
  ngOnInit(){
    console.log("Obteniendo información del usuario");
    this.userService.getUserInfo(2)
    .subscribe({
      next:data => {
        this.user.description=data.data.descripcion
        this.user.urlPfp=data.data.uuidFoto

        this.user.urlHeader=data.data.uuidPortada
        this.user.fechaNacimiento=data.data.fechaNacimiento
        this.dia=this.user.fechaNacimiento.substring(8,10)
        this.mes=this.user.fechaNacimiento.substring(5,7)
        this.year=this.user.fechaNacimiento.substring(0,4)
        console.log(this.dia)
        console.log(this.mes)
        console.log(this.year)
        this.registroDia=data.data.fechaRegistro.substring(8,10)
        this.registroMes=data.data.fechaRegistro.substring(5,7)
        this.registroYear=data.data.fechaRegistro.substring(0,4)
        this.user.genero=data.data.genero
        //carrera-agregar logica
        this.user.correo=data.data.correo
        this.user.celular=data.data.celular

        console.log(data.data)
    },
    error: (error) => console.log(error),
  })
  }
}
