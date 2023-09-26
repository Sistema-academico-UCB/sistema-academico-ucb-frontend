import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { StudentService } from 'src/app/service/student.service';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})

export class ProfileEditComponent {
  
  // Constructor
  constructor(private userService: UserService, private StudentService: StudentService) {}

  // Controlador para el mensaje de error
  @ViewChild('errorMessage') errorMessage!: ElementRef;
  // Controladores para la descripcion
  @ViewChild('Description') Description!: ElementRef;

  // Datos del usuario
  user = { name: '', username: '', email: '', register: '', urlPfp: '', urlHeader: '', description: ''};

  // Variables
  txtDescription: string = this.user.description; // Descripción del usuario
  confirmationPopup = false; // Popup de confirmación
  errorPopup = false; // Popup de error

  // Obtiene la información del usuario al cargar la página
  ngOnInit(){
    console.log("Obteniendo información del usuario");
    this.userService.getUserInfo(2)
    .subscribe({
      next:data => {
        if (this.user.urlPfp == ''){
          this.user.urlPfp = '../../../assets/icons/usuario.png';
        } else {
          this.user.urlPfp = data.data.uuidFoto;
        }
        if (this.user.urlHeader == ''){
          this.user.urlHeader = '../../../assets/icons/portada-arboles.jpg';
        } else {
          this.user.urlHeader = data.data.uuidPortada;
        }
        this.user.description = data.data.descripcion;
        this.txtDescription = this.user.description;
    },
    error: (error) => console.log(error),
  })
  }

  // Campos para las fotos
  selectedPfp: File;
  selectedHeader: File;
  onFileSelectedPfp(event: any) {
    this.selectedPfp = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result != null){
        this.user.urlPfp = reader.result?.toString();
        console.log(this.user.urlPfp);
      }
    };
    reader.readAsDataURL(this.selectedPfp);
  }
  onFileSelectedHeader(event: any) {
    this.selectedHeader = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result != null){
        this.user.urlHeader = reader.result?.toString();
        console.log(this.user.urlHeader);
      }
    };
    reader.readAsDataURL(this.selectedHeader);
  }

  // Función para guardar los datos
  guardarDatos(){
    if(this.validacion()) {
      console.log("Guardando datos");
      this.StudentService.updateStudent(this.txtDescription)
      .subscribe({
        next:data => {
          console.log(data);
          this.confirmationPopup = true;
      },
      error: (error) => console.log(error),
      })
    } else {
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
  /*Validacion*/
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
