import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { CarrerDto } from 'src/app/dto/carrer.dto';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-view-students',
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.css']
})
export class ViewStudentsComponent {

  carrers: CarrerDto[] = [];
  selectedCarrerValue: string = '-1';
  searchStudent = new FormControl();
  students: any[] = [];
  page = new FormControl();
  pageSize = new FormControl();

  searchText: string = ''; // Propiedad para almacenar la cadena de búsqueda
  filteredStudents: any[] = []; // Arreglo filtrado de estudiantes

  constructor(private router: Router, private studentService: StudentService) { 
    this.studentService.getCarrers().subscribe(
      (data: any) => {
        this.carrers = data.data;
      }
    );
  }

  ngOnInit(): void {
    this.changeSearchStudent();
    this.changePage(0,5,'');
  }

  // Función para controlar los cambios del page y pageSize
  changePage(page: number, pageSize: number, searchText?: string) {
    this.studentService.getStudents(page, pageSize).subscribe(
      (data: any) => {
        this.students = data.data;
  
        // Filtrar la lista de estudiantes basándose en el parámetro 'searchText'
        this.filteredStudents = this.students.filter(student => {
          const studentName = student.nombre ? student.nombre.toLowerCase() : ''; // Asegúrate de que el nombre no sea null o undefined
          const searchTextLowerCase = searchText ? searchText.toLowerCase() : ''; // Asegúrate de que la cadena de búsqueda no sea null o undefined
          
          return studentName.includes(searchTextLowerCase);
        });
      }
    );
  }

  // Función para redirigir a la página de añadir estudiante
  addStudent(){
    this.router.navigate(['add-student']);
  }

  // Función para redirigir a la página de editar estudiante
  editStudent(studentId: number){
    this.router.navigate(['edit-student', studentId]);
  }

  // Función para redirigir a la página de eliminar estudiante
  deleteStudent(studentId: number){
    this.router.navigate(['delete-student', studentId]);
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

  onInputChange() {
    console.log('Numero de la pagina', this.inputValue1);
    console.log('Tamaño de los datos', this.inputValue2);
    console.log('Carnet de identidad', this.searchText);
    this.changePage(this.inputValue1 -1, this.inputValue2, this.searchText);

  }

}