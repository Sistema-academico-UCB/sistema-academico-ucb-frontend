import { Component, ElementRef, ViewChild } from '@angular/core';
import { CarrerDto } from 'src/app/dto/carrer.dto';
import { CollegeDto } from 'src/app/dto/college.dto';
import { StudentService } from 'src/app/service/student.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentDto } from 'src/app/dto/student.dto';


@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent {

  constructor(private StudentService: StudentService, private datePipe: DatePipe, private route: ActivatedRoute, private router: Router) {
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
  colegios: CollegeDto[] = [];
  // Lista de carreras
  carreras: CarrerDto[] = [];

  // Estudiante
  estudiante: StudentDto = {
    estudianteId: 0,
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
    semestre: 0,
    colegioId: 0,
    carreraId: 0,
    estado: true
  };

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.id = params['student'];
    });
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
    if (this.id != null) {
      //Obtener datos del estudiante
      this.StudentService.getStudent(this.id).subscribe(
        (data: any) => {
          console.log(data);
          this.estudiante = data.data;
          this.estudiante.fechaNacimiento = this.estudiante.fechaNacimiento.split('T')[0];
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
          this.loadingPopup = true;
          console.log(this.estudiante);
          this.StudentService.updateStudent(this.estudiante).subscribe(
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
    if (!this.estudiante.nombre) {
      this.mensajeError();
    } else if (!this.estudiante.apellidoPaterno) {
      this.mensajeError();
    } else if (!this.estudiante.apellidoMaterno) {
      this.mensajeError();
    } else if (!this.estudiante.carnetIdentidad) {
      this.mensajeError();
    } else if (!this.estudiante.fechaNacimiento) {
      this.mensajeError();
    } else {
      flag = true;
    }
    return flag;
  }
  /*Validar segunda sección*/
  validacion2() {
    let flag = false;
    if (!this.estudiante.correo) {
      this.mensajeError();
    } else if (!this.estudiante.celular) {
      this.mensajeError();
    } else if (!this.estudiante.direccion) {
      this.mensajeError();
    } else {
      flag = true;
    }
    return flag;
  }
  /*Validar otras secciones*/
  validacion3(){
    let flag = false;
    this.estudiante.colegioId = Number(this.estudiante.colegioId);
    this.estudiante.carreraId = Number(this.estudiante.carreraId);
    if(this.estudiante.colegioId == 0){
      this.mensajeError();
    } else if(this.estudiante.semestre < 1){
      this.mensajeError();
    } else if(!this.estudiante.username){
      this.mensajeError();
    } else if(this.estudiante.carreraId == 0){
      this.mensajeError();
    } else {
      flag = true;
    }
    return flag;
  }

  addData(){
    const firstName = this.estudiante.nombre.split(' ')[0].toLowerCase();
    const lastName = this.estudiante.apellidoPaterno.split(' ')[0].toLowerCase();
    this.estudiante.username = firstName+"."+lastName;
    this.estudiante.correo = firstName+"."+lastName+"@ucb.edu.bo";
  }

}
