import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

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

  //Funcion para obtener la lista de departamentos
  getDepartments() {
    return this.http.get(`${environment.BACKEND_URL}/api/v1/departments`);
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

}
