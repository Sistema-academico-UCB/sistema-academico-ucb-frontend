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
  user = { name: '', username: '', email: '', register: '', uuidFoto: '', uuidPortada: '', description: ''};

  // Variables
  txtDescription: string = this.user.description; // Descripción del usuario
  confirmationPopup = false; // Popup de confirmación
  errorPopup = false; // Popup de error

  // Obtiene la información del usuario al cargar la página
  ngOnInit(){
    console.log("Obteniendo información del usuario");
    this.userService.getUserInfo()
    .subscribe({
      next:data => {
        console.log(data);
        if (data.data.uuidFoto == ''){
          this.user.uuidFoto = '../../../assets/icons/usuario.png';
        } else {
          this.user.uuidFoto = data.data.uuidFoto;
        }
        if (data.data.uuidPortada == ''){
          this.user.uuidPortada = '../../../assets/icons/portada-arboles.jpg';
        } else {
          this.user.uuidPortada = data.data.uuidPortada;
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
        this.user.uuidFoto = reader.result?.toString();
        console.log(this.user.uuidFoto);
      }
    };
    reader.readAsDataURL(this.selectedPfp);
  }
  onFileSelectedHeader(event: any) {
    this.selectedHeader = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result != null){
        this.user.uuidPortada = reader.result?.toString();
        console.log(this.user.uuidPortada);
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
