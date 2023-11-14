import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { CarrerDto } from 'src/app/dto/carrer.dto';
import { StudentService } from 'src/app/service/student.service';
import { UserService } from 'src/app/service/user.service';
import * as XLSX from 'xlsx';

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
  studentDeletedId: number;
  // Lista de carreras
  carreras: CarrerDto[] = [];
  total: number = 0;


  searchText: string = ''; // Propiedad para almacenar la cadena de búsqueda
  searchCI: string = ''; // Propiedad para almacenar la cadena de búsqueda
  filteredStudents: any[] = []; // Arreglo filtrado de estudiantes

  constructor(private router: Router, private studentService: StudentService, private userService: UserService) { 
    this.studentService.getCarrers().subscribe(
      (data: any) => {
        this.carrers = data.data;
      }
    );
  }

  ngOnInit(): void {
    this.changeSearchStudent();
    this.changePage(this.inputValue1 -1 , this.inputValue2,'','',1,1);
    // Obtener la lista de carreras
    this.studentService.getCarrers().subscribe(
      (data: any) => {
        this.carreras = data.data;
        console.log(data)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Función para controlar los cambios del page y pageSize
  changePage(page: number, pageSize: number, searchText: string, searchCI: string, semestre:number, carrera:number) {
    console.log(page, pageSize, searchText, semestre)
    this.studentService.getStudents(page, pageSize, searchText, searchCI, semestre, carrera).subscribe(
      (data: any) => {
        this.students = data.data;
        this.total = data.totalElements;
        this.listaElementos = this.generateMockData(this.total);
        console.log(data)
      }
    );
  }

  // Función para redirigir a la página de añadir estudiante
  addStudent(){
    this.router.navigate(['add-student']);
  }

  // Función para redirigir a la página de editar estudiante
  editStudent(studentId: number){
    this.router.navigate(['student-edit', studentId]);
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
  inputValue3: number = 0;
  inputValue4: number = 0;


  onInputChange() {
    console.log('Numero de la pagina', this.inputValue1);
    console.log('Tamaño de los datos', this.inputValue2);
    console.log(this.inputValue3);
    console.log('Carnet de identidad', this.searchText);
    console.log(this.inputValue4);
    this.inicio = (this.inputValue2 * (this.paginaActual-1)) + 1;
    this.fin = (this.inputValue2 * this.paginaActual) + 1
    if(this.fin > this.total){
      this.fin = this.total;
    }

    this.changePage(this.inputValue1 -1, this.inputValue2, this.searchText, this.searchCI,this.inputValue3, this.inputValue4);

  }

  //Logica para el popup
  isDialogVisible = false;
  openConfirmationDialog(userId: number) {
    this.studentDeletedId = userId; 
    this.isDialogVisible = true;
  }


  confirmDelete() {
    // Realiza la eliminación aquí
    if (this.studentDeletedId) {
      // Realiza la eliminación utilizando this.friendToDeleteId
      console.log('Elemento eliminado:', this.studentDeletedId);
      // Limpia el ID después de la eliminación
      this.userService.deletedUser(this.studentDeletedId).subscribe(
        (data: any) => {
          console.log(data);
          this.ngOnInit();
        }
      );
      this.studentDeletedId = 0;


    }
    this.isDialogVisible = false; // Cierra el cuadro de diálogo
  }

  cancelDelete() {
    // Cancela la eliminación aquí
    console.log('Eliminación cancelada');
    this.isDialogVisible = false; // Cierra el cuadro de diálogo
  }

  //Logica para la paginación - arreglar****
  listaElementos: any[] = this.generateMockData(this.total);
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

  /*Logica para la importación datos excel*/
  carnetsSet = new Set<string>();
  emailSet = new Set<string>();
  confirmationPopup = false;
  hasDuplicates = false;
  hasInvalidData = false;
  celularRegex = /^\d+$/; // Expresión regular para verificar que el campo celular solo contenga dígitos

  onFileChange(event: any): void {
    const target: DataTransfer = event.target as DataTransfer;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const sheetName: string = workbook.SheetNames[0];
      const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      const data: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Aquí 'data' contiene los datos del archivo Excel.
      console.log(data);

      // Validación previa para el carnet de identidad
      for (const studentData of data) {
        const carnetIdentidad = studentData[3];
        const email = studentData[5]; 
        const celular = studentData[7];
        // Validación para el carnet de identidad
        if (this.carnetsSet.has(carnetIdentidad)) {
          this.hasDuplicates = true;
          console.error(`Error: El carnet de identidad ${carnetIdentidad} está duplicado.`);
          break;
        } else {
          this.carnetsSet.add(carnetIdentidad);
        }
        
        // Validación para el correo electrónico
        if (this.emailSet.has(email)) {
          this.hasDuplicates = true;
          console.error(`Error: El correo electrónico ${email} está duplicado.`);
          break; 
        } else {
          this.emailSet.add(email);
        }

        if (typeof celular === 'string' && !celular.match(this.celularRegex)) {
          this.hasInvalidData = true;
          console.error(`Error: El número de celular ${celular} no es válido. Solo se permiten dígitos.`);
          break; 
        }
      }

      if (this.hasDuplicates || this.hasInvalidData) {
        console.error('Se encontraron duplicados en los carnets de identidad, correos electrónicos o datos no válidos. No se pueden registrar estudiantes.');
      } else {
          data.forEach(studentData => {
            console.log(studentData);
            const nombre = studentData[0]; 
            const apellidoPaterno = studentData[1];
            const apellidoMaterno = studentData[2]; 
            const carnetIdentidad = studentData[3];
            const fechaNacimiento = studentData[4];
            const correo = studentData[5];
            const genero = studentData[6];
            const celular = studentData[7];
            const direccion = studentData[8];
            const fechaRegistro = studentData[9];
            const estadoCivil = studentData[10];
            const username = studentData[11];
            const secret = studentData[12];
            const semestre = studentData[13];
            const colegioId = studentData[14];
            const carreraId = studentData[15];
            // Llama a tu función createStudent del servicio con los datos del estudiante.
            this.studentService.createStudent(
              nombre,
              apellidoPaterno,
              apellidoMaterno,
              carnetIdentidad,
              fechaNacimiento,
              correo,
              genero,
              celular,
              direccion,
              fechaRegistro,
              estadoCivil,
              username,
              secret,
              semestre,
              colegioId,
              carreraId
            ).subscribe(
              response => {
                console.log('Estudiante registrado con éxito', response);
              },
              error => {
                console.error('Error al registrar estudiante', error);
              }
            );
          });
          this.confirmationPopup = true;
        }
    };
    reader.readAsBinaryString(target.files[0]);
  }
}