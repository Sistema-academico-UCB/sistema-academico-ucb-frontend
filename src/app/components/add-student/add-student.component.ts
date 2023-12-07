import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CarrerDto } from 'src/app/dto/carrer.dto';
import { CollegeDto } from 'src/app/dto/college.dto';
import { StudentDto } from 'src/app/dto/student.dto';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent {

  // Variables
  fechaActual: Date = new Date();

  constructor(private StudentService: StudentService, private router: Router) {
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
  colegios: CollegeDto[] = [];
  // Lista de carreras
  carreras: CarrerDto[] = [];
  // Nuevo estudiante
  newStudent: StudentDto = {
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    carnetIdentidad: "",
    fechaNacimiento: "",
    correo: "",
    genero: "Hombre",
    celular: "",
    descripcion: "",
    uuidFoto: "../../../assets/icons/usuario.png",
    uuidPortada: "../../../assets/icons/portada-arboles.jpg",
    direccion: "",
    fechaRegistro: "",
    estadoCivil: "Soltero/a",
    username: "",
    secret: "",
    rol: "Estudiante",
    semestre: 1,
    colegioId: 0,
    carreraId: 0,
    estado: true
  };

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
          this.newStudent.fechaRegistro = this.fechaActual.toISOString();
          this.StudentService.createStudent(this.newStudent).subscribe(
            (data: any) => {
              this.loadingPopup = false;
              console.log(data);
              this.confirmationPopup = true;
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
    this.newStudent = {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      carnetIdentidad: "",
      fechaNacimiento: "",
      correo: "",
      genero: "Hombre",
      celular: "",
      descripcion: "",
      uuidFoto: "../../../assets/icons/usuario.png",
      uuidPortada: "../../../assets/icons/portada-arboles.jpg",
      direccion: "",
      fechaRegistro: "",
      estadoCivil: "Soltero/a",
      username: "",
      secret: "",
      rol: "Estudiante",
      semestre: 1,
      colegioId: 0,
      carreraId: 0,
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
    if (!this.newStudent.nombre) {
      this.mensajeError();
    } else if (!this.newStudent.apellidoPaterno) {
      this.mensajeError();
    } else if (!this.newStudent.apellidoMaterno) {
      this.mensajeError();
    } else if (!this.newStudent.carnetIdentidad) {
      this.mensajeError();
    } else if (!this.newStudent.fechaNacimiento) {
      this.mensajeError();
    } else {
      flag = true;
    }
    return flag;
  }
  /*Validar segunda sección*/
  validacion2() {
    let flag = false;
    if (!this.newStudent.correo) {
      this.mensajeError();
    } else if (!this.newStudent.celular) {
      this.mensajeError();
    } else if (!this.newStudent.direccion) {
      this.mensajeError();
    } else {
      flag = true;
    }
    return flag;
  }
  /*Validar siguientes secciones*/
  validacion3(){
    let flag = false;
    this.newStudent.colegioId = Number(this.newStudent.colegioId);
    this.newStudent.carreraId = Number(this.newStudent.carreraId);
    if(this.newStudent.colegioId == 0){
      this.mensajeError();
    } else if(this.newStudent.semestre < 1){
      this.mensajeError();
    } else if(!this.newStudent.username){
      this.mensajeError();
    } else if(this.newStudent.carreraId == 0){
      this.mensajeError();
    } else {
      flag = true;
    }
    return flag;
  }

  /*Funcion para actualizar el pawssword*/
  updatePassword(){
    this.newStudent.secret = this.newStudent.carnetIdentidad;
  }

  addData() {
    const firstName = this.newStudent.nombre.split(' ')[0].toLowerCase();
    const lastName = this.newStudent.apellidoPaterno.split(' ')[0].toLowerCase();
    this.newStudent.username = firstName+"."+lastName;
    this.newStudent.correo = firstName+"."+lastName+"@ucb.edu.bo";
  }
}
