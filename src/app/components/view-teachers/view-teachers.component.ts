import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { CarrerDto } from 'src/app/dto/carrer.dto';
import { TeacherService } from 'src/app/service/teacher.service';
import { UserService } from 'src/app/service/user.service';
import { DepartmentDto } from 'src/app/dto/department.dto';


@Component({
  selector: 'app-view-teachers',
  templateUrl: './view-teachers.component.html',
  styleUrls: ['./view-teachers.component.css']
})
export class ViewTeachersComponent {
  carrers: CarrerDto[] = [];
  selectedCarrerValue: string = '-1';
  searchStudent = new FormControl();
  students: any[] = [];
  page = new FormControl();
  pageSize = new FormControl();
  teacherDeletedId: number;
  // Lista de departamentos
  departamentos: DepartmentDto[] = [];


  searchText: string = ''; // Propiedad para almacenar la cadena de búsqueda
  searchCI: string = ''; // Propiedad para almacenar la cadena de búsqueda
  filteredStudents: any[] = []; // Arreglo filtrado de estudiantes

  constructor(private router: Router, private teacherService: TeacherService, private userService: UserService) { 

  }

  ngOnInit(): void {
    this.changeSearchStudent();
    this.changePage(this.inputValue1 -1 , this.inputValue2,'','',1);
    // Obtener la lista de departamentos
    this.teacherService.getDepartments().subscribe(
      (data: any) => {
        this.departamentos = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Función para controlar los cambios del page y pageSize
  changePage(page: number, pageSize: number, searchText: string, searchCI: string, departamentoCarreraId:number) {
    console.log(page, pageSize, searchText, departamentoCarreraId)
    this.teacherService.getTeachers(page, pageSize, searchText, searchCI, departamentoCarreraId).subscribe(
      (data: any) => {
        this.students = data.data;
        console.log(this.students)
      }
    );
  }

  // Función para redirigir a la página de añadir estudiante
  addStudent(){
    this.router.navigate(['add-teacher']);
  }

  // Función para redirigir a la página de editar estudiante
  editStudent(studentId: number){
    this.router.navigate(['teacher-edit', studentId]);
  }

  // Función para redirigir a la página de eliminar estudiante
  deleteStudent(studentId: number){
    this.router.navigate(['delete-teacher', studentId]);
  }

  // Función para controlar los cambios del select
  changeSelectCarrer() {
    console.log(this.selectedCarrerValue);
    // Llamar al servicio para buscar estudiantes
  }

  // Función para controlar los cambios del input de búsqueda
  changeSearchStudent() {
    this.searchStudent.valueChanges.pipe(debounceTime(500)).subscribe(
      (data: any) => {
        console.log(data);
        // Aplicar el filtrado solo si la cadena de búsqueda no está vacía
        this.filteredStudents = this.searchText
          ? this.students.filter(student => student.name.toLowerCase().includes(this.searchText.toLowerCase()))
          : this.students;
        // Llamar al servicio para buscar estudiantes
        //this.changePage();
      }
    );
  }
  inputValue1: number = 1;
  inputValue2: number = 10;
  inputValue3: number = 0;


  onInputChange() {
    console.log('Numero de la pagina', this.inputValue1);
    console.log('Tamaño de los datos', this.inputValue2);
    console.log('Carnet de identidad', this.searchText);
    console.log('Carrera', this.selectedCarrerValue)
    console.log('Departemento',this.inputValue3)

    this.inicio = (this.inputValue2 * (this.paginaActual-1)) + 1;
    this.fin = (this.inputValue2 * this.paginaActual) + 1

    this.changePage(this.inputValue1 -1, this.inputValue2, this.searchText, this.searchCI, this.inputValue3);

  }

  
  //Logica para el popup
  isDialogVisible = false;
  openConfirmationDialog(userId: number) {
    this.teacherDeletedId = userId; 
    this.isDialogVisible = true;
  }


  confirmDelete() {
    // Realiza la eliminación aquí
    if (this.teacherDeletedId) {
      // Realiza la eliminación utilizando this.friendToDeleteId
      console.log('Elemento eliminado:', this.teacherDeletedId);
      // Limpia el ID después de la eliminación
      this.userService.deletedUser(this.teacherDeletedId).subscribe(
        (data: any) => {
          console.log(data);
          this.ngOnInit();
        }
      );
      this.teacherDeletedId = 0;


    }
    this.isDialogVisible = false; // Cierra el cuadro de diálogo
  }

  cancelDelete() {
    // Cancela la eliminación aquí
    console.log('Eliminación cancelada');
    this.isDialogVisible = false; // Cierra el cuadro de diálogo
  }

   //Logica para la paginación - arreglar****
   listaElementos: any[] = this.generateMockData(100);
   elementosPorPagina = 10;
   paginaActual = 1;
   mathProperty: any;
   inicio = 1;
   fin = 10;
 
   onPageChange(page: number): void {
     this.paginaActual = page;
     this.inputValue1 = page;
     this.onInputChange();
   }
 
   private generateMockData(count: number): any[] {
     return Array.from({ length: count }).map((_, index) => ({
       id: index + 1,
       nombre: `Elemento ${index + 1}`,
       descripcion: `Descripción del Elemento ${index + 1}`
     }));
   }
}
