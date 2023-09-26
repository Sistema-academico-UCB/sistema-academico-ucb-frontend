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
  public getTeacherInfo(userId: number): Observable<any>{
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
  updateTeacher(descripcion:string){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      //'Authorization': 'Bearer $token',
    };
    const body = {
      "nombre": "Roberta",
      "apellidoPaterno": "Gonzalez",
      "apellidoMaterno": "Perez",
      "carnetIdentidad": "12345678",
      "fechaNacimiento": "1990-01-01",
      "correo": "roberta.gonzalezaaa@gmail.com",
      "genero": "Mujer :D",
      "celular": "12345678",
      "descripcion": descripcion,
      "uuidFoto": "./assets/icons/usuario.png",
      "uuidPortada": "./assets/icons/portada-arboles.jpg",
      "direccion": "Av. America #1234",
      "fechaRegistro": "2023-01-01",
      "estadoCivil": "Soltero/a",
      "username": "roberta.gonzalez",
      "secret": "1234567899",
      "rol": "Docente",
      "tipo": "Tiempo completo",
      "profesionId": 1,
      "departamentoCarreraId": 1,
      "directorCarrera": true,
      "estado": true
      
      // 'descripcion': descripcion,
      // //'uuidFoto': '',
      // //'uuidPortada': '',
      // 'rol': 'Estudiante',
      
      // 'estado': true
    }
    return this.http.put(`${environment.BACKEND_URL}/api/v1/teacher/1`, body, { headers: header });

  }

}
