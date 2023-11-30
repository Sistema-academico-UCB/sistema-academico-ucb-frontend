import { Component } from '@angular/core';
import { CarrerDto } from 'src/app/dto/carrer.dto';
import { AdminService } from 'src/app/service/admin.service';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.css']
})
export class CareersComponent {

  carrers: CarrerDto[] = [];
  aux: any = [];
  sigla: string = '';
  nombre: string = '';
  modeEdit: boolean = false;
  showPopup: boolean = false;
  popupTitle: string = 'Carrera guardada';
  popupMessage: string = 'La carrera se guardó correctamente';
  popupIcon: string = 'fa-regular fa-circle-check gradient-green';
  showPopupDelete: boolean = false;

  constructor(private studentService: StudentService, private adminService: AdminService) {
    this.getCarrers();
  }

  getCarrers() {
    this.studentService.getCarrers().subscribe(
      (data: any) => {
        this.carrers = data.data;
      }
    );
  }

  emptyMessage: boolean = false;
  addCarrer() {
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
        'carrera': true,
        'estado': true
      }
      this.adminService.addCarrer(body).subscribe(
        (data: any) => {
          if (data.success){
            this.getCarrers();
            this.popupTitle = 'Carrera guardada';
            this.popupMessage = 'La carrera se guardó correctamente';
            this.popupIcon = 'fa-regular fa-circle-check gradient-green';
            this.showPopup = true;
            this.sigla = '';
            this.nombre = '';
            setTimeout(() => {
              this.showPopup = false;
            }, 2000);
          } else {
            this.popupTitle = 'Error';
            this.popupMessage = 'La carrera no se pudo guardar';
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

  editCarrer(carrer: CarrerDto) {
    console.log(carrer);
    this.aux = carrer;
    this.sigla = carrer.sigla;
    this.nombre = carrer.nombre;
    this.modeEdit = true;
  }

  updateCarrer() {
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
        'carrera': true,
        'estado': true
      }
      this.adminService.updateCarrer(body, this.aux.carreraId).subscribe(
        (data: any) => {
          if (data.success){
            this.getCarrers();
            this.popupTitle = 'Carrera actualizada';
            this.popupMessage = 'La carrera se actualizó correctamente';
            this.popupIcon = 'fa-regular fa-circle-check gradient-green';
            this.showPopup = true;
            this.cancelEdit();
            setTimeout(() => {
              this.showPopup = false;
            }, 2000);
          } else {
            this.popupTitle = 'Error';
            this.popupMessage = 'La carrera no se pudo actualizar';
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

  deleteCarrer(carrer: CarrerDto) {
    this.aux = carrer;
    this.showPopupDelete = true;
  }

  cancelDelete() {
    this.showPopupDelete = false;
    this.aux = [];
  }

  confirmDelete() {
    this.adminService.deleteCarrer(this.aux.carreraId).subscribe(
      (data: any) => {
        this.showPopupDelete = false;
        if(data.success) {
          this.carrers = this.carrers.filter(carrer => carrer.carreraId !== this.aux.carreraId);
          this.popupTitle = 'Carrera eliminada';
          this.popupMessage = 'La carrera se eliminó correctamente';
          this.popupIcon = 'fa-regular fa-circle-check gradient-green';
          this.showPopup = true;
          setTimeout(() => {
            this.showPopup = false;
          }, 2000);
        } else {
          this.popupTitle = 'Error';
          this.popupMessage = 'La carrera no se pudo eliminar';
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
