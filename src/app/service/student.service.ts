import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StudentDto } from '../dto/student.dto';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  studentUrl = `${environment.BACKEND_URL}/api/v1/student`;
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  // Funcion para obtener la lista de colegios
  getColleges() {
    return this.http.get(`${environment.BACKEND_URL}/api/v1/colleges`);
  }
  // Funcion para obtener la lista de carreras
  getCarrers() {
    return this.http.get(`${environment.BACKEND_URL}/api/v1/careers`);
  }
  // Funcion para obtener carrera por medio de Id
  getCarrerById(id: number):  Observable<any>{
    return this.http.get<any>(`${environment.BACKEND_URL}/api/v1/careers/${id}`);
  }

  // Función para crear un estudiante
  createStudent(student: StudentDto) {
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
    return this.http.post(this.studentUrl, student, { headers: header });
  }

  // Función para actualizar un estudiante
  updateStudent(student: StudentDto){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
    return this.http.put(`${environment.BACKEND_URL}/api/v1/student/${student.estudianteId}`, student, { headers: header });

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