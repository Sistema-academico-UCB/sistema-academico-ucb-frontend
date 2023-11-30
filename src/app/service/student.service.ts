import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  studentUrl = `${environment.BACKEND_URL}/api/v1/student`;

  constructor(private http: HttpClient) { }

  //Funcion para obtener la lista de colegios
  getColleges() {
    return this.http.get(`${environment.BACKEND_URL}/api/v1/colleges`);
  }

  //Funcion para obtener la lista de carreras
  getCarrers() {
    return this.http.get(`${environment.BACKEND_URL}/api/v1/careers`);
  }
  //Funcion para obtener carrera por medio de Id
  getCarrerById(id: number):  Observable<any>{
    return this.http.get<any>(`${environment.BACKEND_URL}/api/v1/careers/${id}`);
  }

  //Función para crear un estudiante
  createStudent(nombre: string, apellidoPaterno: string, apellidoMaterno: string, carnetIdentidad: string, 
    fechaNacimiento: Date, correo: string, genero: string, celular: string, direccion: string, 
    fechaRegistro: Date, estadoCivil: string, username: string, secret: string, semestre: number, 
    colegioId: number, carreraId: number) {
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      //'Authorization': 'Bearer $token',
    };
    const body = {
      'nombre': nombre,
      'apellidoPaterno': apellidoPaterno,
      'apellidoMaterno': apellidoMaterno,
      'carnetIdentidad': carnetIdentidad,
      'fechaNacimiento': fechaNacimiento,
      'correo': correo,
      'genero': genero,
      'celular': celular,
      'descripcion': 'Hola, soy estudiante de la universidad',
      'uuidFoto': '',
      'uuidPortada': '',
      'direccion': direccion,
      'fechaRegistro': fechaRegistro,
      'estadoCivil': estadoCivil,
      'username': username,
      'secret': secret,
      'rol': 'Estudiante',
      'semestre': semestre,
      'colegioId': colegioId,
      'carreraId': carreraId,
      'estado': true
    }
    return this.http.post(this.studentUrl, body, { headers: header });
  }
  updateStudent(Id: number, nombre: string, apellidoPaterno: string, apellidoMaterno: string, carnetIdentidad: string, 
    fechaNacimiento: Date, correo: string, genero: string, celular: string, descripcion: string, uuidFoto: String, uuidPortada: String ,direccion: string, 
    fechaRegistro: Date, estadoCivil: string, username: string, secret: string, semestre: number, 
    colegioId: number, carreraId: number){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      //'Authorization': 'Bearer $token',
    };
    const body = {
      'nombre': nombre,
      'apellidoPaterno': apellidoPaterno,
      'apellidoMaterno': apellidoMaterno,
      'carnetIdentidad': carnetIdentidad,
      'fechaNacimiento': fechaNacimiento,
      'correo': correo,
      'genero': genero,
      'celular': celular,
      'descripcion': descripcion,
      'uuidFoto': uuidFoto,
      'uuidPortada': uuidPortada,
      'direccion': direccion,
      'fechaRegistro': fechaRegistro,
      'estadoCivil': estadoCivil,
      'username': username,
      'secret': secret,
      'rol': 'Estudiante',
      'semestre': semestre,
      'colegioId': colegioId,
      'carreraId': carreraId,
      'estado': true
    }
    return this.http.put(`${environment.BACKEND_URL}/api/v1/student/${Id}`, body, { headers: header });

  }
  
  // Obtener los estudiantes por medio de page y pageSize
  getStudents(page: number, pageSize: number, name: string, ci: string, semestre:number, carrera:number) {
    console.log(`${environment.BACKEND_URL}/api/v1/student?page=${page}&size=${pageSize}&nombre=${name}&carnet_identidad=${ci}&carrera_id=${carrera}&semestre=${semestre}&sortType=asc`)
    return this.http.get(`${environment.BACKEND_URL}/api/v1/student?page=${page}&size=${pageSize}&nombre=${name}&carnet_identidad=${ci}&carrera_id=${carrera}&semestre=${semestre}&sortType=asc`);
  }


  // Obtener estudiante por medio de Id
  getStudent(Id: string){
    return this.http.get(`${environment.BACKEND_URL}/api/v1/student/${Id}`)
  }
}