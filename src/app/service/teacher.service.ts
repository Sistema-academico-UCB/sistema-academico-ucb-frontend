import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TeacherDto } from '../dto/teacher.dto';


@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  teacherUrl = `${environment.BACKEND_URL}/api/v1/teacher`;
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  //Funcion para obtener la lista de profesiones
  getProfessions() {
    return this.http.get(`${environment.BACKEND_URL}/api/v1/professions`);
  }
  //Funcion para obtener profesion por medio de Id
  getProfessionsById(id: number): Observable<any> {
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
    return this.http.get<any>(`${environment.BACKEND_URL}/api/v1/teacher/${userId}`);
  }
  //Función para crear un profesor
  createTeacher(teacher: TeacherDto): Observable<any> {
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
    return this.http.post<any>(this.teacherUrl, teacher, { headers: header });
  }

  //Función para actualizar el registro de un profesor por medio de Id
  updateTeacher(teacher: TeacherDto) {
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
    return this.http.put(`${environment.BACKEND_URL}/api/v1/teacher/${teacher.docenteId}`, teacher, { headers: header });
  }

  // Obtener los docentes por medio de page y pageSize
  getTeachers(page: number, pageSize: number, name: string, ci: string, departamento:number) {
    return this.http.get(`${environment.BACKEND_URL}/api/v1/teacher?page=${page}&size=${pageSize}&nombre=${name}&carnet_identidad=${ci}&departamento_id=${departamento}&sortType=asc`);
  }

}
