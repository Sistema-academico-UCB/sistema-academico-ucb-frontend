import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  adminUrl = `${environment.BACKEND_URL}/api/v1`;	

  constructor(private http: HttpClient) { }

  //Agregar carrera
  addCarrer(body: any) {
    return this.http.post(`${this.adminUrl}/careers`, body);
  }
  //Actualizar carrera
  updateCarrer(body: any, carrerId: Number) {
    return this.http.put(`${this.adminUrl}/careers/${carrerId}`, body);
  }
  //Eliminar carrera
  deleteCarrer(carrerId: Number) {
    return this.http.delete(`${this.adminUrl}/careers/${carrerId}`);
  }

  //Agregar departamento
  addDepartment(body: any) {
    return this.http.post(`${this.adminUrl}/departments`, body);
  }
  //Actualizar departamento
  updateDepartment(body: any, departmentId: Number) {
    return this.http.put(`${this.adminUrl}/departments/${departmentId}`, body);
  }
  //Eliminar departamento
  deleteDepartment(departmentId: Number) {
    return this.http.delete(`${this.adminUrl}/departments/${departmentId}`);
  }

  //Agregar profesion
  addProfession(body: any) {
    return this.http.post(`${this.adminUrl}/professions`, body);
  }
  //Actualizar profesion
  updateProfession(body: any, professionId: number) {
    return this.http.put(`${this.adminUrl}/professions/${professionId}`, body);
  }
  //Eliminar profesion
  deleteProfession(professionId: number) {
    return this.http.delete(`${this.adminUrl}/professions/${professionId}`);
  }
}
