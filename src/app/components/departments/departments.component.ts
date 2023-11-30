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

  departamentos: DepartmentDto[] = [];
  aux: any = [];
  sigla: string = '';
  nombre: string = '';
  modeEdit: boolean = false;
  showPopup: boolean = false;
  popupTitle: string = 'Departamento guardado';
  popupMessage: string = 'El departamento se guardó correctamente';
  popupIcon: string = 'fa-regular fa-circle-check gradient-green';
  showPopupDelete: boolean = false;

  constructor(private teacherService: TeacherService, private adminService: AdminService) {
    this.getDepartments();
  }

  getDepartments() {
    this.teacherService.getDepartments().subscribe(
      (data: any) => {
        this.departamentos = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  emptyMessage: boolean = false;
  addDepto() {
    const siglaAux = this.sigla.replace(/\s/g, '');
    const nombreAux = this.nombre.replace(/\s/g, '');
    if (siglaAux === '' || nombreAux === '') {
      this.emptyMessage = true;
      setTimeout(() => {
        this.emptyMessage = false;
      }, 2000);
    } else {
      const body = {
        'sigla': this.sigla,
        'nombre': this.nombre,
        'programa': this.nombre,
        'carrera': false,
        'estado': true
      }
      this.adminService.addDepartment(body).subscribe(
        (data: any) => {
          if (data.success){
            this.getDepartments();
            this.popupTitle = 'Departamento guardado';
            this.popupMessage = 'El departamento se guardó correctamente';
            this.popupIcon = 'fa-regular fa-circle-check gradient-green';
            this.showPopup = true;
            this.sigla = '';
            this.nombre = '';
            setTimeout(() => {
              this.showPopup = false;
            }, 2000);
          } else {
            this.popupTitle = 'Error';
            this.popupMessage = 'El departamento no se pudo guardar';
            this.popupIcon = 'fa-regular fa-circle-xmark gradient-red';
            this.showPopup = true;
            setTimeout(() => {
              this.showPopup = false;
            }, 2000);
          }
        }
      );
    }
  }

  editDepto(depto: DepartmentDto) {
    console.log(depto);
    this.aux = depto;
    this.sigla = depto.sigla;
    this.nombre = depto.nombre;
    this.modeEdit = true;
  }

  updateDepto() {
    const siglaAux = this.sigla.replace(/\s/g, '');
    const nombreAux = this.nombre.replace(/\s/g, '');
    if (siglaAux === '' || nombreAux === '') {
      this.emptyMessage = true;
      setTimeout(() => {
        this.emptyMessage = false;
      }, 2000);
    } else {
      const body = {
        'sigla': this.sigla,
        'nombre': this.nombre,
        'programa': this.nombre,
        'carrera': false,
        'estado': true
      }
      this.adminService.updateDepartment(body, this.aux.carreraId).subscribe(
        (data: any) => {
          if (data.success){
            this.getDepartments();
            this.popupTitle = 'Departamento guardado';
            this.popupMessage = 'El departamento se guardó correctamente';
            this.popupIcon = 'fa-regular fa-circle-check gradient-green';
            this.showPopup = true;
            this.cancelEdit();
            setTimeout(() => {
              this.showPopup = false;
            }, 2000);
          } else {
            this.popupTitle = 'Error';
            this.popupMessage = 'El departamento no se pudo guardar';
            this.popupIcon = 'fa-regular fa-circle-xmark gradient-red';
            this.showPopup = true;
            setTimeout(() => {
              this.showPopup = false;
            }, 2000);
          }
        }
      );
    }
  }

  cancelEdit() {
    this.modeEdit = false;
    this.sigla = '';
    this.nombre = '';
    this.aux = [];
  }

  deleteDepto(depto: DepartmentDto) {
    this.aux = depto;
    this.showPopupDelete = true;
  }

  cancelDelete() {
    this.showPopupDelete = false;
    this.aux = [];
  }

  confirmDelete() {
    this.adminService.deleteDepartment(this.aux.carreraId).subscribe(
      (data: any) => {
        this.showPopupDelete = false;
        if (data.success){
          this.departamentos = this.departamentos.filter(depto => depto.carreraId !== this.aux.carreraId);
          this.popupTitle = 'Departamento eliminado';
          this.popupMessage = 'El departamento se eliminó correctamente';
          this.popupIcon = 'fa-regular fa-circle-check gradient-green';
          this.showPopup = true;
          setTimeout(() => {
            this.showPopup = false;
          }, 2000);
        } else {
          this.popupTitle = 'Error';
          this.popupMessage = 'El departamento no se pudo eliminar';
          this.popupIcon = 'fa-regular fa-circle-xmark gradient-red';
          this.showPopup = true;
          setTimeout(() => {
            this.showPopup = false;
          }, 2000);
        }
        this.aux = [];
      }
    );
  }

}
