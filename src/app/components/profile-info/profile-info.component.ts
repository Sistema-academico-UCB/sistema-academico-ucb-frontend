import { Component } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { StudentService } from 'src/app/service/student.service';


@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent {
  constructor(private userService: UserService, private StudentService: StudentService) {
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
    carrera:'',
    correo:'',
    celular:'',
    fechaNacimiento:'',
    id:0
  };
  dia:string=''
  mes:string=''
  year:string=''
  registroDia:string=''
  registroMes:string=''
  registroYear:string=''
  ngOnInit(){
    console.log("Obteniendo información del usuario");
    this.userService.getOtherUserInfo("2")
    .subscribe({
      next:data => {
        if (data.data.uuidFoto != ''){
          this.user.urlPfp = data.data.uuidFoto;
        }
        if (data.data.uuidPortada != ''){
          this.user.urlHeader = data.data.uuidPortada;
        }
        this.user.description=data.data.descripcion;
        this.user.fechaNacimiento=data.data.fechaNacimiento;
        this.dia=this.user.fechaNacimiento.substring(8,10);
        this.mes=this.user.fechaNacimiento.substring(5,7);
        this.year=this.user.fechaNacimiento.substring(0,4);
        console.log(this.dia);
        console.log(this.mes);
        console.log(this.year);
        this.registroDia=data.data.fechaRegistro.substring(8,10);
        this.registroMes=data.data.fechaRegistro.substring(5,7);
        this.registroYear=data.data.fechaRegistro.substring(0,4);
        this.user.genero=data.data.genero;
        this.user.correo=data.data.correo;
        this.user.celular=data.data.celular;
        this.user.id=data.data.estudianteId;
        this.StudentService.getCarrerById(data.data.carreraId)
        .subscribe({
          next:data => {
            this.user.carrera = data.data.nombre;
          }
        })
        console.log(data.data);
    },
    error: (error) => console.log(error),
  })
  }
}
