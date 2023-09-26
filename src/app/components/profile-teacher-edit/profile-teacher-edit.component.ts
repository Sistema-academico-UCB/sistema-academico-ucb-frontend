import { Component, ElementRef, ViewChild } from '@angular/core';
import { TeacherService } from 'src/app/service/teacher.service';


@Component({
  selector: 'app-profile-teacher-edit',
  templateUrl: './profile-teacher-edit.component.html',
  styleUrls: ['./profile-teacher-edit.component.css']
})
export class ProfileTeacherEditComponent {
  constructor(private TeacherService: TeacherService) {
  }
  /*Declaramos los atributos del estudiante*/
  @ViewChild('errorMessage') errorMessage!: ElementRef;
  /*Primera sección*/
  @ViewChild('Description') Description!: ElementRef;

  user = {
    name: '',
    username: '',
    email: '',
    register: '',
    urlPfp: '',
    urlHeader: '',
    description: ''
  };
  ngOnInit(){
    console.log("Obteniendo información del usuario");
    this.TeacherService.getTeacherInfo(1)
    .subscribe({
      next:data => {
        this.user.description=data.data.descripcion
        this.user.urlPfp=data.data.uuidFoto

        this.user.urlHeader=data.data.uuidPortada
        console.log(data.data)
        this.txtDescription = this.user.description;
        
    },
    error: (error) => console.log(error),
  })
  }
  txtDescription: string = this.user.description;
  // Popup de confirmación
  confirmationPopup = false;
  // Popup de error
  errorPopup = false;


   guardarDatos(){
     if(this.validacion()){
       console.log("Guardando datos");
       this.confirmationPopup = true;
       this.TeacherService.updateTeacher(this.txtDescription)
      
       .subscribe({
       next:data => {
          console.log(data)
      },
      error: (error) => console.log(error),
       })
     }else{
       console.log("Datos no guardados");
    }
   }
  /*Mensaje error*/
  mensajeError(atributo: number) {
    let atributos = [
      this.Description,
      
    ];
    this.errorMessage.nativeElement.classList.add('warning-active');
    atributos[atributo].nativeElement.classList.add('input-empty');
    setTimeout(() => {
      this.errorMessage.nativeElement.classList.remove('warning-active');
      atributos[atributo].nativeElement.classList.remove('input-empty');
    }, 3000);
  }
  validacion() {
    let flag = false;
    if (this.txtDescription == "") {
      this.mensajeError(1);
    } else {
      flag = true;
    }
    return flag;
  }
}
