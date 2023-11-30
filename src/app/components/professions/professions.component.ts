import { Component } from '@angular/core';
import { set } from 'date-fns';
import { ProfessionDto } from 'src/app/dto/profession.dto';
import { AdminService } from 'src/app/service/admin.service';
import { TeacherService } from 'src/app/service/teacher.service';

@Component({
  selector: 'app-professions',
  templateUrl: './professions.component.html',
  styleUrls: ['./professions.component.css']
})
export class ProfessionsComponent {

  profesiones: ProfessionDto[] = [];
  aux: any = [];
  nombre: string = '';
  modeEdit: boolean = false;
  showPopup: boolean = false;
  popupTitle: string = 'Profesión guardada';
  popupMessage: string = 'La profesión se guardó correctamente';
  popupIcon: string = 'fa-regular fa-circle-check gradient-green';
  showPopupDelete: boolean = false;

  constructor(private teacherService: TeacherService, private adminService: AdminService) {
    this.getProfessions();
  }

  getProfessions() {
    this.teacherService.getProfessions().subscribe(
      (data: any) => {
        this.profesiones = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  emptyMessage: boolean = false;
  addProf() {
    const nombreAux = this.nombre.replace(/\s/g, '');
    if (nombreAux === '') {
      this.emptyMessage = true;
      setTimeout(() => {
        this.emptyMessage = false;
      }, 2000);
    } else {
      const body = {
        'nombreProfesion': this.nombre,
        'estado': true
      }
      this.adminService.addProfession(body).subscribe(
        (data: any) => {
          if (data.success){
            this.getProfessions();
            this.popupTitle = 'Profesión guardada';
            this.popupMessage = 'La profesión se guardó correctamente';
            this.popupIcon = 'fa-regular fa-circle-check gradient-green';
            this.showPopup = true;
            this.nombre = '';
            setTimeout(() => {
              this.showPopup = false;
            }, 2000);
          } else {
            this.popupTitle = 'Error';
            this.popupMessage = 'La profesión no se guardó correctamente';
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

  editProf(profesion: ProfessionDto) {
    console.log(profesion);
    this.aux = profesion;
    this.nombre = profesion.nombreProfesion;
    this.modeEdit = true;
  }

  updateProf() {
    const nombreAux = this.nombre.replace(/\s/g, '');
    if (nombreAux === '') {
      this.emptyMessage = true;
      setTimeout(() => {
        this.emptyMessage = false;
      }, 2000);
    } else {
      const body = {
        'nombreProfesion': this.nombre,
        'estado': true
      }
      this.adminService.updateProfession(body, this.aux.profesionId).subscribe(
        (data: any) => {
          if (data.success){
            this.getProfessions();
            this.popupTitle = 'Profesión actualizada';
            this.popupMessage = 'La profesión se actualizó correctamente';
            this.popupIcon = 'fa-regular fa-circle-check gradient-green';
            this.showPopup = true;
            this.cancelEdit();
            setTimeout(() => {
              this.showPopup = false;
            }, 2000);
          } else {
            this.popupTitle = 'Error';
            this.popupMessage = 'La profesión no se pudo actualizar';
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
    this.nombre = '';
    this.aux = [];
  }

  deleteProf(profesion: ProfessionDto) {
    this.aux = profesion;
    this.showPopupDelete = true;
  }

  cancelDelete() {
    this.showPopupDelete = false;
    this.aux = [];
  }

  confirmDelete() {
    this.adminService.deleteProfession(this.aux.profesionId).subscribe(
      (data: any) => {
        this.showPopupDelete = false;
        if (data.success){
          this.profesiones = this.profesiones.filter(profesion => profesion.profesionId !== this.aux.profesionId); 
          this.popupTitle = 'Profesión eliminada';
          this.popupMessage = 'La profesión se eliminó correctamente';
          this.popupIcon = 'fa-regular fa-circle-check gradient-green';
          this.showPopup = true;
          setTimeout(() => {
            this.showPopup = false;
          }, 2000);
        } else {
          this.popupTitle = 'Error';
          this.popupMessage = 'La profesión no se pudo eliminar';
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
