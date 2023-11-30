import { Component } from '@angular/core';
import { ProfessionDto } from 'src/app/dto/profession.dto';
import { AdminService } from 'src/app/service/admin.service';
import { TeacherService } from 'src/app/service/teacher.service';

@Component({
  selector: 'app-professions',
  templateUrl: './professions.component.html',
  styleUrls: ['./professions.component.css']
})
export class ProfessionsComponent {

  id: Number = 0;
  nombre: string = '';
  profesiones: ProfessionDto[] = [];
  modeEdit: boolean = false;

  constructor(private teacherService: TeacherService, private adminService: AdminService) {
    this.teacherService.getProfessions().subscribe(
      (data: any) => {
        this.profesiones = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addProf() {
    const prof: ProfessionDto = {
      nombreProfesion: this.nombre,
      estado: true
    }
    this.adminService.addProfession(prof).subscribe(
      (data: any) => {
        this.profesiones.push(data.data);
      }
    );
  }

  editProf(profesion: ProfessionDto) {
    console.log(profesion);
    this.id = profesion.profesionId || 0;
    this.nombre = profesion.nombreProfesion;
    this.modeEdit = true;
  }

  updateProf() {
    console.log(this.id);
    console.log(this.nombre);
    this.adminService.updateProfession(this.nombre, this.id).subscribe(
      (data: any) => {
        this.profesiones.push(data.data);
      }
    );
  }

  cancelEdit() {
    this.modeEdit = false;
    this.id = 0;
    this.nombre = '';
  }

  deleteDepto(profesionId: Number) {
    console.log(profesionId);
    this.adminService.deleteProfession(profesionId).subscribe(
      (data: any) => {
        this.profesiones = this.profesiones.filter(prof => prof.profesionId !== profesionId);
      }
    );
  }

}
