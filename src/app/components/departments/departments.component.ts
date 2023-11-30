import { Component } from '@angular/core';
import { DepartmentDto } from 'src/app/dto/department.dto';
import { AdminService } from 'src/app/service/admin.service';
import { TeacherService } from 'src/app/service/teacher.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent {

  id: Number = 0;
  nombre: string = '';
  departamentos: DepartmentDto[] = [];
  modeEdit: boolean = false;

  constructor(private teacherService: TeacherService, private adminService: AdminService) {
    this.teacherService.getDepartments().subscribe(
      (data: any) => {
        this.departamentos = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addDepto() {
    const depto: DepartmentDto = {
      sigla: '',
      nombre: this.nombre,
      programa: this.nombre,
      carrera: false,
      estado: true
    }
    this.adminService.addDepartment(depto).subscribe(
      (data: any) => {
        this.departamentos.push(data.data);
      }
    );
  }

  editDepto(depto: DepartmentDto) {
    console.log(depto);
    this.id = depto.carreraId || 0;
    this.nombre = depto.nombre;
    this.modeEdit = true;
  }

  updateDepto() {
    console.log(this.id);
    console.log(this.nombre);
    this.adminService.updateDepartment(this.nombre, this.id).subscribe(
      (data: any) => {
        this.departamentos.push(data.data);
      }
    );
  }

  cancelEdit() {
    this.modeEdit = false;
    this.id = 0;
    this.nombre = '';
  }

  deleteDepto(deptoId: Number) {
    console.log(deptoId);
    this.adminService.deleteDepartment(deptoId).subscribe(
      (data: any) => {
        this.departamentos = this.departamentos.filter(depto => depto.carreraId !== deptoId);
      }
    );
  }

}
