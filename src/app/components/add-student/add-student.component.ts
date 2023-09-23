import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent {

  fechaActual: Date = new Date();
  lugarResidencia = "Bolivia";
  departamento = "La Paz";

  /*Colegios*/
  colegios = [
    {
      colegioId: 1,
      nombreColegio: "San Calixto",
    },
    {
      colegioId: 2,
      nombreColegio: "Don Bosco",
    },
    {
      colegioId: 3,
      nombreColegio: "San Ignacio",
    },
    {
      colegioId: 4,
      nombreColegio: "San Agustin",
    },
    {
      colegioId: 5,
      nombreColegio: "San Antonio",
    },
  ];

  /*Carreras*/
  carreras = [
    {
      carreraId: 1,
      sigla: "Ing. Sistemas",
      nombre: "Ingenieria de Sistemas",
    },
    {
      carreraId: 2,
      sigla: "Ing. Civil",
      nombre: "Ingenieria Civil",
    },
    {
      carreraId: 3,
      sigla: "Ing. Industrial",
      nombre: "Ingenieria Industrial",
    },
    {
      carreraId: 4,
      sigla: "Ing. Mecanica",
      nombre: "Ingenieria Mecanica",
    },
    {
      carreraId: 5,
      sigla: "Ing. Electrica",
      nombre: "Ingenieria Electrica",
    },
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


  guardarDatos() {
    if(this.validación1()){
      if(this.validación2()){
        console.log("Datos guardados");
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
    ];
    this.errorMessage.nativeElement.classList.add('warning-active');
    atributos[atributo].nativeElement.classList.add('input-empty');
    setTimeout(() => {
      this.errorMessage.nativeElement.classList.remove('warning-active');
      atributos[atributo].nativeElement.classList.remove('input-empty');
    }, 3000);
  }
  /*Validar primer sección*/
  validación1() {
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
  validación2() {
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
}
