import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent {
  // Variables
  fechaActual: number = Date.now();
  lugarResidencia = "Bolivia";
  departamento = "La Paz";

  // Lista de colegios
  tipoDocentes = [ "Docente", "Auxiliar", "Investigador" ];

  // Lista de profesiones
  profesiones = [
    {
      profesionId: 1,
      nombreProfesion: "Ingeniería de Sistemas"
    }, {
      profesionId: 2,
      nombreProfesion: "Ingeniería Civil"
    }, {
      profesionId: 3,
      nombreProfesion: "Ingeniería Electrónica"
    }, {
      profesionId: 4,
      nombreProfesion: "Ingeniería Industrial"
    }
  ];

  // Lista de departamentos
  departamentos = [
    {
      departamentoCarreraId: 1,
      nombre: 'Educación'
    }, {
      departamentoCarrera: 2,
      nombre: 'Ingeniería'
    }, {
      departamentoCarreraId: 3,
      nombre: 'Ciencias Sociales'
    }, {
      departamentoCarreraId: 4,
      nombre: 'Ciencias Exactas'
    }
  ];
  /*Declaramos los atributos del estudiante*/
  @ViewChild('errorMessage') errorMessage!: ElementRef;
  /*Primera sección*/
  @ViewChild('nombreInput') nombreInput!: ElementRef;
  @ViewChild('apellidoPaternoInput') apellidoPaternoInput!: ElementRef;
  @ViewChild('apellidoMaternoInput') apellidoMaternoInput!: ElementRef;
  @ViewChild('ciInput') ciInput!: ElementRef;
  @ViewChild('fechaNacimientoInput') fechaNacimientoInput!: ElementRef;
  @ViewChild('generoSelect') generoSelect!: ElementRef;
  /*Segunda sección*/
  @ViewChild('correoInput') correoInput!: ElementRef;
  @ViewChild('celularInput') celularInput!: ElementRef;
  @ViewChild('direccionInput') direccionInput!: ElementRef;
  /*Tercera sección*/
  @ViewChild('estadoCivilSelect') estadoCivilSelect!: ElementRef;
  @ViewChild('usuarioInput') usuarioInput!: ElementRef;
  @ViewChild('contrasenaInput') contrasenaInput!: ElementRef;
  @ViewChild('contrasenaConfirmacionInput') contrasenaConfirmacionInput!: ElementRef;
  /*Cuarta sección*/
  @ViewChild('tipoDocenteSelect') tipoDocenteSelect!: ElementRef;
  @ViewChild('profesionSelect') profesionSelect!: ElementRef;
  @ViewChild('deptoSelect') deptoSelect!: ElementRef;
  @ViewChild('checkDirector') checkDirector!: ElementRef;

  // Popup de confirmación
  confirmationPopup = false;

  // Funcion para guardar los datos
  guardarDatos() {
    if(this.validacion1()){
      if(this.validacion2()){
        if(this.validacion3()){
          if(this.validacion4()){
            this.confirmationPopup = true;
            let teacher = {
              nombre: this.nombreInput.nativeElement.value,
              apellido_paterno: this.apellidoPaternoInput.nativeElement.value,
              apellido_materno: this.apellidoMaternoInput.nativeElement.value,
              carnet_identidad: this.ciInput.nativeElement.value,
              fecha_nacimiento: this.fechaNacimientoInput.nativeElement.value,
              correo: this.correoInput.nativeElement.value,
              genero: this.generoSelect.nativeElement.value,
              celular: this.celularInput.nativeElement.value,
              descripcion: "",
              uuid_foto: "./assets/icons/usuario.png",
              uuid_portada: "./assets/icons/portada-arboles.jpg",
              direccion: this.direccionInput.nativeElement.value,
              fecha_registro: this.fechaActual,
              estado_civil: this.estadoCivilSelect.nativeElement.value,
              username: this.usuarioInput.nativeElement.value,
              secret: this.contrasenaInput.nativeElement.value,
              rol: "Docente",
              tipo: this.tipoDocenteSelect.nativeElement.value,
              profesion_id: this.profesionSelect.nativeElement.value,
              departamento_carrera_id: this.deptoSelect.nativeElement.value,
              director_carrera_id: this.checkDirector.nativeElement.checked
            };
            console.log(teacher);
          }
        }
      }
    } else {
      console.log("Datos no guardados");
    }
  }

  /*Mensaje error*/
  mensajeError(atributo: number) {
    let atributos = [
      this.nombreInput,
      this.apellidoPaternoInput,
      this.apellidoMaternoInput,
      this.ciInput,
      this.fechaNacimientoInput,
      this.correoInput,
      this.celularInput,
      this.direccionInput,
      this.usuarioInput,
      this.contrasenaInput,
      this.contrasenaConfirmacionInput,
      this.profesionSelect,
      this.deptoSelect
    ];
    this.errorMessage.nativeElement.classList.add('warning-active');
    atributos[atributo].nativeElement.classList.add('input-empty');
    setTimeout(() => {
      this.errorMessage.nativeElement.classList.remove('warning-active');
      atributos[atributo].nativeElement.classList.remove('input-empty');
    }, 3000);
  }
  /*Validar primer sección*/
  validacion1() {
    let flag = false;
    if (!this.nombreInput.nativeElement.value) {
      this.mensajeError(0);
    } else if (!this.apellidoPaternoInput.nativeElement.value) {
      this.mensajeError(1);
    } else if (!this.apellidoMaternoInput.nativeElement.value) {
      this.mensajeError(2);
    } else if (!this.ciInput.nativeElement.value) {
      this.mensajeError(3);
    } else if (!this.fechaNacimientoInput.nativeElement.value) {
      this.mensajeError(4);
    } else {
      flag = true;
    }
    return flag;
  }
  /*Validar segunda sección*/
  validacion2() {
    let flag = false;
    if (!this.correoInput.nativeElement.value) {
      this.mensajeError(5);
    } else if (!this.celularInput.nativeElement.value) {
      this.mensajeError(6);
    } else if (!this.direccionInput.nativeElement.value) {
      this.mensajeError(7);
    } else {
      flag = true;
    }
    return flag;
  }
  /*Validar tercera sección*/
  @ViewChild('passwordError') passwordError!: ElementRef;
  validacion3(){
    let flag = false;
    if(!this.usuarioInput.nativeElement.value){
      this.mensajeError(8);
    } else if(!this.contrasenaInput.nativeElement.value){
      this.mensajeError(9);
    } else if(!this.contrasenaConfirmacionInput.nativeElement.value){
      this.mensajeError(10);
    } else if(this.contrasenaInput.nativeElement.value != this.contrasenaConfirmacionInput.nativeElement.value){
      this.passwordError.nativeElement.classList.add('password-active');
      this.contrasenaInput.nativeElement.classList.add('input-empty');
      this.contrasenaConfirmacionInput.nativeElement.classList.add('input-empty');
      setTimeout(() => {
        this.passwordError.nativeElement.classList.remove('password-active');
        this.contrasenaInput.nativeElement.classList.remove('input-empty');
        this.contrasenaConfirmacionInput.nativeElement.classList.remove('input-empty');
      }, 3000);
    } else {
      flag = true;
    }
    return flag;
  }
  /*Validar cuarta sección*/
  validacion4(){
    let flag = false;
    if (this.profesionSelect.nativeElement.value == "0") {
      this.mensajeError(11);
    } else if (this.deptoSelect.nativeElement.value == "0") {
      this.mensajeError(12);
    } else {
      flag = true;
    }
    return flag;
  }
}
