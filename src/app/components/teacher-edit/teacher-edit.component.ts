import { Component, ElementRef, ViewChild } from '@angular/core';
import { DepartmentDto } from 'src/app/dto/department.dto';
import { ProfessionDto } from 'src/app/dto/profession.dto';
import { TeacherService } from 'src/app/service/teacher.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrls: ['./teacher-edit.component.css']
})
export class TeacherEditComponent {
  // Variables
  fechaActual: Date = new Date();
  lugarResidencia = "Bolivia";
  departamento = "La Paz";

  constructor(private TeacherService: TeacherService, private datePipe: DatePipe, private route: ActivatedRoute, private router: Router) {
    const rol = localStorage.getItem('rol');
    if(rol == 'ADMIN') {
      console.log('Acceso concedido');
    } else if (rol == 'DOCENTE' || rol == 'ESTUDIANTE') {
      window.alert('No tienes permisos para acceder a esta página');
      this.router.navigate(['/profile']);
    } else {
      window.alert('No has iniciado sesión');
      this.router.navigate(['/login']);
    }
  }
  id: string | null;

  // Lista de colegios
  tipoDocentes = [ "Docente", "Auxiliar", "Investigador", "Medio Tiempo", "Tiempo Completo" ];
  // Lista de profesiones
  profesiones: ProfessionDto[] = [];
  // Lista de departamentos
  departamentos: DepartmentDto[] = [];
  docente: any = {};

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['teacher'];
    });
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
    if (this.id != null) {
      //Obtener datos del docente
      this.TeacherService.getTeacherInfo(this.id).subscribe(
        (data: any) => {
          console.log(data);
          this.docente = data.data;
          this.docente.fechaNacimiento = this.datePipe.transform(this.docente.fechaNacimiento, 'yyyy-MM-dd');
        },
        (error) => {
          console.log(error);
        }
      )
    }
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
            this.TeacherService.updateTeacher(
              this.docente.docenteId,
              this.nombreInput.nativeElement.value,
              this.apellidoPaternoInput.nativeElement.value,
              this.apellidoMaternoInput.nativeElement.value,
              this.ciInput.nativeElement.value,
              this.fechaNacimientoInput.nativeElement.value,
              this.correoInput.nativeElement.value,
              this.generoSelect.nativeElement.value,
              this.celularInput.nativeElement.value,
              this.docente.descripcion,
              this.docente.uuidFoto,
              this.docente.uuidPortada,
              this.direccionInput.nativeElement.value,
              this.docente.fechaRegistro,
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
  validacion3(){
    let flag = false;
    if(!this.usuarioInput.nativeElement.value){
      this.mensajeError(8);
    } else if(!this.contrasenaInput.nativeElement.value){
      this.mensajeError(9);
    } else {
      flag = true;
    }
    return flag;
  }
  /*Validar cuarta sección*/
  validacion4(){
    let flag = false;
    if (this.profesionSelect.nativeElement.value == "0") {
      this.mensajeError(10);
    } else if (this.deptoSelect.nativeElement.value == "0") {
      this.mensajeError(11);
    } else {
      flag = true;
    }
    return flag;
  }

}
