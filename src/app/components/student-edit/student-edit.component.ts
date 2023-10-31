import { Component, ElementRef, ViewChild } from '@angular/core';
import { CarrerDto } from 'src/app/dto/carrer.dto';
import { CollegeDto } from 'src/app/dto/college.dto';
import { StudentService } from 'src/app/service/student.service';


@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent {
  
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
  /*Quinta sección*/
  @ViewChild('carreraSelect') carreraSelect!: ElementRef;

  // Popup de confirmación
  confirmationPopup = false;
  // Popup de error
  errorPopup = false;

  // Funcion para guardar los datos
  guardarDatos() {
    if(this.validacion1()){
      if(this.validacion2()){
        if(this.validacion3()){
          if(this.validacion4()){
            if(this.validacion5()){
              this.confirmationPopup = true;
              this.StudentService.createStudent(
                this.nombreInput.nativeElement.value,
                this.apellidoPaternoInput.nativeElement.value,
                this.apellidoMaternoInput.nativeElement.value,
                this.ciInput.nativeElement.value,
                this.fechaNacimientoInput.nativeElement.value,
                this.correoInput.nativeElement.value,
                this.generoSelect.nativeElement.value,
                this.celularInput.nativeElement.value,
                this.direccionInput.nativeElement.value,
                this.fechaActual,
                this.estadoCivilSelect.nativeElement.value,
                this.usuarioInput.nativeElement.value,
                this.contrasenaInput.nativeElement.value,
                this.semestreInput.nativeElement.value,
                this.colegioSelect.nativeElement.value,
                this.carreraSelect.nativeElement.value
              ).subscribe(
                (data: any) => {
                  console.log(data);
                  this.limpiarCampos();
                },
                (error) => {
                  console.log(error);
                  this.errorPopup = true;
                }
              );
            }
          }
        }
      }
    } else {
      console.log("Datos no guardados");
    }
  }

  /*Limpiar campos*/
  limpiarCampos() {
    this.nombreInput.nativeElement.value = "";
    this.apellidoPaternoInput.nativeElement.value = "";
    this.apellidoMaternoInput.nativeElement.value = "";
    this.ciInput.nativeElement.value = "";
    this.fechaNacimientoInput.nativeElement.value = "";
    this.correoInput.nativeElement.value = "";
    this.celularInput.nativeElement.value = "";
    this.direccionInput.nativeElement.value = "";
    this.semestreInput.nativeElement.value = "";
    this.usuarioInput.nativeElement.value = "";
    this.contrasenaInput.nativeElement.value = "";
    this.colegioSelect.nativeElement.value = "0";
    this.carreraSelect.nativeElement.value = "0";
    this.estadoCivilSelect.nativeElement.value = "Soltero/a";
    this.generoSelect.nativeElement.value = "Hombre";
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
  validacion4(){
    let flag = false;
    if(!this.usuarioInput.nativeElement.value){
      this.mensajeError(10);
    } else if(!this.contrasenaInput.nativeElement.value){
      this.mensajeError(11);
    } else {
      flag = true;
    }
    return flag;
  }
  /*Validar quinta sección*/
  validacion5(){
    let flag = false;
    if(this.carreraSelect.nativeElement.value == "0"){
      this.mensajeError(12);
    } else {
      flag = true;
    }
    return flag;
  }

  /*Funcion para actualizar el pawssword*/
  updatePassword(){
    this.contrasenaInput.nativeElement.value = this.ciInput.nativeElement.value;
  }
}
