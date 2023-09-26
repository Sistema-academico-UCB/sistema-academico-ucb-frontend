import { Component, ElementRef, ViewChild } from '@angular/core';
import { DepartmentDto } from 'src/app/dto/department.dto';
import { ProfessionDto } from 'src/app/dto/profession.dto';
import { TeacherService } from 'src/app/service/teacher.service';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent {
  // Variables
  fechaActual: Date = new Date();
  lugarResidencia = "Bolivia";
  departamento = "La Paz";

  constructor(private TeacherService: TeacherService) { }

  // Lista de colegios
  tipoDocentes = [ "Docente", "Auxiliar", "Investigador", "Medio Tiempo", "Tiempo Completo" ];
  // Lista de profesiones
  profesiones: ProfessionDto[] = [];
  // Lista de departamentos
  departamentos: DepartmentDto[] = [];

  ngOnInit() {
    // Obtener la lista de profesiones
    this.TeacherService.getProfessions().subscribe(
      (data: any) => {
        this.profesiones = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
    // Obtener la lista de departamentos
    this.TeacherService.getDepartments().subscribe(
      (data: any) => {
        this.departamentos = data.data;
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
  // Popup de error
  errorPopup = false;

  // Funcion para guardar los datos
  guardarDatos() {
    if(this.validacion1()){
      if(this.validacion2()){
        if(this.validacion3()){
          if(this.validacion4()){
            this.confirmationPopup = true;
            this.TeacherService.createTeacher(
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
              this.tipoDocenteSelect.nativeElement.value,
              this.profesionSelect.nativeElement.value,
              this.deptoSelect.nativeElement.value,
              this.checkDirector.nativeElement.checked
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
    } else {
      console.log("Datos no guardados");
    }
  }

  /*Limpiar campos*/
  limpiarCampos() {
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
    atributos.forEach(atributo => {
      atributo.nativeElement.value = "";
    });
    this.generoSelect.nativeElement.value = "Hombre";
    this.estadoCivilSelect.nativeElement.value = "Soltero/a";
    this.tipoDocenteSelect.nativeElement.value = "Docente";
    this.checkDirector.nativeElement.checked = false;
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
