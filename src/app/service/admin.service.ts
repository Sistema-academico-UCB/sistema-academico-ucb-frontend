import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarrerDto } from '../dto/carrer.dto';
import { environment } from 'src/environments/environment';
import { DepartmentDto } from '../dto/department.dto';
import { ProfessionDto } from '../dto/profession.dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  //Agregar carrera
  addCarrer(carrer: CarrerDto) {
    console.log(carrer);
    return this.http.post(`${environment.BACKEND_URL}/carrers`, carrer);
  }
  //Actualizar carrera
  updateCarrer(sigla: string, nombre: string, carrerId: Number) {
    const body = {
      departamento_carrera_id: carrerId,
      sigla: sigla,
      nombre: nombre
    }
    return this.http.put(`${environment.BACKEND_URL}/carrers`, body);
  }
  //Eliminar carrera
  deleteCarrer(carrerId: Number) {
    return this.http.delete(`${environment.BACKEND_URL}/carrers/` + carrerId);
  }

  //Agregar departamento
  addDepartment(department: DepartmentDto) {
    return this.http.post(`${environment.BACKEND_URL}/departments`, department);
  }
  //Actualizar departamento
  updateDepartment(departmentName: string, departmentId: Number) {
    const body = {
      departamento_carrera_id: departmentId,
      nombre: departmentName
    }
    return this.http.put(`${environment.BACKEND_URL}/departments`, body);
  }
  //Eliminar departamento
  deleteDepartment(departmentId: Number) {
    return this.http.delete(`${environment.BACKEND_URL}/departments/` + departmentId);
  }

  //Agregar profesion
  addProfession(profession: ProfessionDto) {
    return this.http.post(`${environment.BACKEND_URL}/professions`, profession);
  }
  //Actualizar profesion
  updateProfession(professionName: string, professionId: Number) {
    const body = {
      profesion_id: professionId,
      nombre_profesion: professionName
    }
    return this.http.put(`${environment.BACKEND_URL}/professions`, body);
  }
  //Eliminar profesion
  deleteProfession(professionId: Number) {
    return this.http.delete(`${environment.BACKEND_URL}/professions/` + professionId);
  }
}
