import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentDto } from 'src/app/dto/department.dto';
import { ProfessionDto } from 'src/app/dto/profession.dto';
import { TeacherDto } from 'src/app/dto/teacher.dto';
import { TeacherService } from 'src/app/service/teacher.service';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent {

  fechaActual: Date = new Date();
  docente: TeacherDto = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    carnetIdentidad: '',
    fechaNacimiento: '',
    correo: '',
    genero: 'Hombre',
    celular: '',
    descripcion: '',
    uuidFoto: "../../../assets/icons/usuario.png",
    uuidPortada: "../../../assets/icons/portada-arboles.jpg",
    direccion: '',
    fechaRegistro: '',
    estadoCivil: "Soltero/a",
    username: '',
    secret: '',
    rol: 'Docente',
    tipo: '',
    profesionId: 0,
    departamentoCarreraId: 0,
    directorCarrera: false,
    estado: true
  };

  constructor(private TeacherService: TeacherService, private router: Router) {
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
    this.docente.tipo = this.tipoDocentes[0];
  }

  /*Declaramos los atributos del estudiante*/
  @ViewChild('errorMessage') errorMessage!: ElementRef;

  // Loading popup
  loadingPopup = false;
  // Popup de confirmación
  confirmationPopup = false;
  // Popup de error
  errorPopup = false;

  // Funcion para guardar los datos
  guardarDatos() {
    if(this.validacion1()){
      if(this.validacion2()){
        if(this.validacion3()){
          this.loadingPopup = true;
          this.docente.fechaRegistro = this.fechaActual.toISOString();
          this.TeacherService.createTeacher(this.docente).subscribe(
            (data: any) => {
              this.loadingPopup = false;
              this.confirmationPopup = true;
              console.log(data);
              this.limpiarCampos();
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

  /*Limpiar campos*/
  limpiarCampos() {
    this.docente = {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      carnetIdentidad: '',
      fechaNacimiento: '',
      correo: '',
      genero: 'Hombre',
      celular: '',
      descripcion: '',
      uuidFoto: "../../../assets/icons/usuario.png",
      uuidPortada: "../../../assets/icons/portada-arboles.jpg",
      direccion: '',
      fechaRegistro: '',
      estadoCivil: "Soltero/a",
      username: '',
      secret: '',
      rol: 'Docente',
      tipo: '',
      profesionId: 0,
      departamentoCarreraId: 0,
      directorCarrera: false,
      estado: true
    };
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
  /*Validar otras secciones*/
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

  /*Funcion para actualizar el pawssword*/
  updatePassword(){
    this.docente.secret = this.docente.carnetIdentidad;
  }

  addData() {
    const firstName = this.docente.nombre.split(' ')[0].toLowerCase();
    const lastName = this.docente.apellidoPaterno.split(' ')[0].toLowerCase();
    this.docente.username = firstName+"."+lastName;
    this.docente.correo = firstName+"."+lastName+"@ucb.edu.bo";
  }
}
