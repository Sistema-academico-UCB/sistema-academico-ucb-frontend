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
  id: Number = 0;
  sigla: string = '';
  nombre: string = '';
  modeEdit: boolean = false;

  constructor(private studentService: StudentService, private adminService: AdminService) {
    this.studentService.getCarrers().subscribe(
      (data: any) => {
        this.carrers = data.data;
      }
    );
  }

  addCarrer() {
    const carrer: CarrerDto = {
      sigla: this.sigla,
      nombre: this.nombre,
      programa: this.nombre,
      carrera: true,
      estado: true
    }
    this.adminService.addCarrer(carrer).subscribe(
      (data: any) => {
        this.carrers.push(data.data);
      }
    );
  }

  editCarrer(carrer: CarrerDto) {
    console.log(carrer);
    this.id = carrer.carreraId || 0;
    this.sigla = carrer.sigla;
    this.nombre = carrer.nombre;
    this.modeEdit = true;
  }

  updateCarrer() {
    console.log(this.id);
    console.log(this.sigla);
    console.log(this.nombre);
    this.adminService.updateCarrer(this.sigla, this.nombre, this.id).subscribe(
      (data: any) => {
        this.carrers.push(data.data);
      }
    );
  }

  cancelEdit() {
    this.modeEdit = false;
    this.id = 0;
    this.sigla = '';
    this.nombre = '';
  }

  deleteCarrer(carrerId: Number) {
    console.log(carrerId);
    this.adminService.deleteCarrer(carrerId).subscribe(
      (data: any) => {
        this.carrers = this.carrers.filter(carrer => carrer.carreraId !== carrerId);
      }
    );
  }

}
