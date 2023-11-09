import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  teacherUrl = `${environment.BACKEND_URL}/api/v1/teacher`;

  constructor(private http: HttpClient) { }

  //Funcion para obtener la lista de profesiones
  getProfessions() {
    return this.http.get(`${environment.BACKEND_URL}/api/v1/professions`);
  }
  //Funcion para obtener profesion por medio de Id
  getProfessionsById(id: number) {
    return this.http.get<any>(`${environment.BACKEND_URL}/api/v1/professions/${id}`);
  }

  //Funcion para obtener la lista de departamentos
  getDepartments() {
    return this.http.get(`${environment.BACKEND_URL}/api/v1/departments`);
  }
  //Funcion para obtener departamento por medio de Id
  getDepartmentsById(id: number) {
    return this.http.get<any>(`${environment.BACKEND_URL}/api/v1/departments/${id}`);
  }
  //Funcion para obtener informacion de un profesor
  public getTeacherInfo(userId: string): Observable<any>{
    //return this.http.get<any>(`${environment.USER_URL}/api/v1/user/`);
    return this.http.get<any>(`http://localhost:8080/api/v1/teacher/${userId}`);
  }
  //Función para crear un profesor
  createTeacher(
    nombre: string, apellidoPaterno: string, apellidoMaterno: string, carnetIdentidad: string,
    fechaNacimiento: Date, correo: string, genero: string, celular: string, direccion: string,
    fechaRegistro: Date, estadoCivil: string, username: string, secret: string, tipo: string,
    profesionId: number, departamentoCarreraId: number, directorCarrera: boolean
  ) {
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
      'descripcion': 'Hola, soy docente de la universidad',
      'uuidFoto': '',
      'uuidPortada': '',
      'direccion': direccion,
      'fechaRegistro': fechaRegistro,
      'estadoCivil': estadoCivil,
      'username': username,
      'secret': secret,
      'rol': 'Docente',
      'tipo': tipo,
      'profesionId': profesionId,
      'departamentoCarreraId': departamentoCarreraId,
      'directorCarrera': directorCarrera,
      'estado': true
    };
    return this.http.post(this.teacherUrl, body, { headers: header });
  }
  updateTeacher(Id: string, nombre: string, apellidoPaterno: string, apellidoMaterno: string, carnetIdentidad: string,
    fechaNacimiento: Date, correo: string, genero: string, celular: string, descripcion: string, uuidFoto: String, uuidPortada: String, direccion: string,
    fechaRegistro: Date, estadoCivil: string, username: string, secret: string, tipo: string,
    profesionId: number, departamentoCarreraId: number, directorCarrera: boolean
  ){
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
      'rol': 'Docente',
      'tipo': tipo,
      'profesionId': profesionId,
      'departamentoCarreraId': departamentoCarreraId,
      'directorCarrera': directorCarrera,
      'estado': true
    }
    return this.http.put(`${environment.BACKEND_URL}/api/v1/teacher/${Id}`, body, { headers: header });

  }

  // Obtener los docentes por medio de page y pageSize
  getTeachers(page: number, pageSize: number, name: string, ci: string, departamento:number) {
    return this.http.get(`${environment.BACKEND_URL}/api/v1/teacher?page=${page}&size=${pageSize}&nombre=${name}&carnet_identidad=${ci}&departamentoId=${departamento}&sortType=asc`);
  }

}
