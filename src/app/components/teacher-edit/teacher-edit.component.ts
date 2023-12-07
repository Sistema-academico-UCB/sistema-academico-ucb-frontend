import { Component, ElementRef, ViewChild } from '@angular/core';
import { DepartmentDto } from 'src/app/dto/department.dto';
import { ProfessionDto } from 'src/app/dto/profession.dto';
import { TeacherService } from 'src/app/service/teacher.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherDto } from 'src/app/dto/teacher.dto';

@Component({
  selector: 'app-teacher-edit',
  templateUrl: './teacher-edit.component.html',
  styleUrls: ['./teacher-edit.component.css']
})
export class TeacherEditComponent {

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

  // Docente
  docente: TeacherDto = {
    docenteId: 0,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    carnetIdentidad: '',
    fechaNacimiento: '',
    correo: '',
    genero: '',
    celular: '',
    descripcion: '',
    uuidFoto: '',
    uuidPortada: '',
    direccion: '',
    fechaRegistro: '',
    estadoCivil: '',
    username: '',
    secret: '',
    rol: '',
    tipo: '',
    profesionId: 0,
    departamentoCarreraId: 0,
    directorCarrera: false,
    estado: true
  };

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
          this.docente.fechaNacimiento = this.docente.fechaNacimiento.split('T')[0];
        },
        (error) => {
          console.log(error);
        }
      )
    }
  }

  /*Declaramos los atributos del estudiante*/
  @ViewChild('errorMessage') errorMessage!: ElementRef;
  
  // Popup de confirmación
  confirmationPopup = false;
  // Popup de error
  errorPopup = false;
  // Loading popup
  loadingPopup = false;

  // Funcion para guardar los datos
  guardarDatos() {
    if(this.validacion1()){
      if(this.validacion2()){
        if(this.validacion3()){
          console.log(this.docente);
          this.loadingPopup = true;
          this.TeacherService.updateTeacher(this.docente).subscribe(
            (data: any) => {
              this.loadingPopup = false;
              this.confirmationPopup = true;
              console.log(data);
            },
            (error) => {
              this.loadingPopup = false;
              console.log(error);
              this.errorPopup = true;
            }
          );
        }
      }
    }
  }

  /*Mensaje error*/
  mensajeError() {
    this.errorMessage.nativeElement.classList.add('warning-active');
    setTimeout(() => {
      this.errorMessage.nativeElement.classList.remove('warning-active');
    }, 3000);
  }
  /*Validar primer sección*/
  validacion1() {
    let flag = false;
    if (!this.docente.nombre) {
      this.mensajeError();
    } else if (!this.docente.apellidoPaterno) {
      this.mensajeError();
    } else if (!this.docente.apellidoMaterno) {
      this.mensajeError();
    } else if (!this.docente.carnetIdentidad) {
      this.mensajeError();
    } else if (!this.docente.fechaNacimiento) {
      this.mensajeError();
    } else {
      flag = true;
    }
    return flag;
  }
  /*Validar segunda sección*/
  validacion2() {
    let flag = false;
    if (!this.docente.correo) {
      this.mensajeError();
    } else if (!this.docente.celular) {
      this.mensajeError();
    } else if (!this.docente.direccion) {
      this.mensajeError();
    } else {
      flag = true;
    }
    return flag;
  }
  /*Validar tercera sección*/
  validacion3(){
    let flag = false;
    this.docente.profesionId = Number(this.docente.profesionId);
    this.docente.departamentoCarreraId = Number(this.docente.departamentoCarreraId);
    if(!this.docente.username){
      this.mensajeError();
    } else if (this.docente.profesionId == 0) {
      this.mensajeError();
    } else if (this.docente.departamentoCarreraId == 0) {
      this.mensajeError();
    } else {
      flag = true;
    }
    return flag;
  }

  addData() {
    const firstName = this.docente.nombre.split(' ')[0].toLowerCase();
    const lastName = this.docente.apellidoPaterno.split(' ')[0].toLowerCase();
    this.docente.username = firstName+"."+lastName;
    this.docente.correo = firstName+"."+lastName+"@ucb.edu.bo";
  }

}
