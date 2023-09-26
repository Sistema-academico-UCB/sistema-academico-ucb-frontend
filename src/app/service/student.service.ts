import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  updateStudent(descripcion:string){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      //'Authorization': 'Bearer $token',
    };
    const body = {
      "nombre": "Kevin",
      "apellidoPaterno": "Perez",
      "apellidoMaterno": "Lopez",
      "carnetIdentidad": "1234567",
      "fechaNacimiento": "1999-01-01",
      "correo": "juan.perez@ucb.edu.bo",
      "genero": "Hombre",
      "celular": "1234567",
      "descripcion": descripcion,
      "uuidFoto": "./assets/icons/usuario.png",
      "uuidPortada": "./assets/icons/portada-arboles.jpg",
      "direccion": "Calle 1",
      "fechaRegistro": "2021-01-01",
      "estadoCivil": "Soltero/a",
      "username": "juan.perez",
      "secret": "123456",
      "rol": "estudiante",
      "semestre": 1,
      "colegioId": 1,
      "carreraId": 1,
      "estado": true
      
      // 'descripcion': descripcion,
      // //'uuidFoto': '',
      // //'uuidPortada': '',
      // 'rol': 'Estudiante',
      
      // 'estado': true
    }
    return this.http.put(`${environment.BACKEND_URL}/api/v1/student/2`, body, { headers: header });

  }
  
}