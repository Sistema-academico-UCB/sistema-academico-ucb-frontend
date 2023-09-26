import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { StudentService } from 'src/app/service/student.service';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})

export class ProfileEditComponent {
  
  constructor(private userService: UserService, private StudentService: StudentService) {
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
    this.userService.getUserInfo(2)
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
      this.StudentService.updateStudent(this.txtDescription)
      
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
