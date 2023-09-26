import { Component, ElementRef, ViewChild } from '@angular/core';
import { CarrerDto } from 'src/app/dto/carrer.dto';
import { CollegeDto } from 'src/app/dto/college.dto';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent {

  // Variables
  fechaActual: Date = new Date();
  lugarResidencia = "Bolivia";
  departamento = "La Paz";

  constructor(private StudentService: StudentService) { }

  // Lista de colegios
  colegios: CollegeDto[] = [];
  // Lista de carreras
  carreras: CarrerDto[] = [];

  ngOnInit(){
    // Obtener la lista de colegios
    this.StudentService.getColleges().subscribe(
      (data: any) => {
        this.colegios = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
    // Obtener la lista de carreras
    this.StudentService.getCarrers().subscribe(
      (data: any) => {
        console.log(data);
        this.carreras = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

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
  @ViewChild('colegioSelect') colegioSelect!: ElementRef;
  @ViewChild('semestreInput') semestreInput!: ElementRef;
  /*Cuarta sección*/
  @ViewChild('usuarioInput') usuarioInput!: ElementRef;
  @ViewChild('contrasenaInput') contrasenaInput!: ElementRef;
  @ViewChild('contrasenaConfirmacionInput') contrasenaConfirmacionInput!: ElementRef;
  /*Quinta sección*/
  @ViewChild('carreraSelect') carreraSelect!: ElementRef;

  // Popup de confirmación
  confirmationPopup = false;

  // Funcion para guardar los datos
  guardarDatos() {
    if(this.validacion1()){
      if(this.validacion2()){
        if(this.validacion3()){
          if(this.validacion4()){
            if(this.validacion5()){
              this.confirmationPopup = true;
              //Armar el json
              let estudiante = {
                nombre: this.nombreInput.nativeElement.value,
                apellido_paterno: this.apellidoPaternoInput.nativeElement.value,
                apellido_materno: this.apellidoMaternoInput.nativeElement.value,
                carnet_identidad: this.ciInput.nativeElement.value,
                fecha_nacimiento: this.fechaNacimientoInput.nativeElement.value,
                correo: this.correoInput.nativeElement.value,
                genero: this.generoSelect.nativeElement.value,
                celular: this.celularInput.nativeElement.value,
                decripcion: "",
                uuid_foto: "./assets/icons/usuario.png",
                uuid_portada: "./assets/icons/portada-arboles.jpg",
                direccion: this.direccionInput.nativeElement.value,
                fecha_registro: this.fechaActual,
                estado_civil: this.estadoCivilSelect.nativeElement.value,
                username: this.usuarioInput.nativeElement.value,
                secret: this.contrasenaInput.nativeElement.value,
                rol: "Estudiante",
                semestre: this.semestreInput.nativeElement.value,
                colegio_id: this.colegioSelect.nativeElement.value,
                carrera_id: this.carreraSelect.nativeElement.value
              }
              console.log(estudiante);
            }
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
      this.colegioSelect,
      this.semestreInput,
      this.usuarioInput,
      this.contrasenaInput,
      this.contrasenaConfirmacionInput,
      this.carreraSelect
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
  validacion3(){
    let flag = false;
    if(this.colegioSelect.nativeElement.value == "0"){
      this.mensajeError(8);
    } else if(this.semestreInput.nativeElement.value < 1){
      this.mensajeError(9);
    } else {
      flag = true;
    }
    return flag;
  }
  /*Validar cuarta sección*/
  @ViewChild('passwordError') passwordError!: ElementRef;
  validacion4(){
    let flag = false;
    if(!this.usuarioInput.nativeElement.value){
      this.mensajeError(10);
    } else if(!this.contrasenaInput.nativeElement.value){
      this.mensajeError(11);
    } else if(!this.contrasenaConfirmacionInput.nativeElement.value){
      this.mensajeError(12);
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
  /*Validar quinta sección*/
  validacion5(){
    let flag = false;
    if(this.carreraSelect.nativeElement.value == "0"){
      this.mensajeError(13);
    } else {
      flag = true;
    }
    return flag;
  }
}
