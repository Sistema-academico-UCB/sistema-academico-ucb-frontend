import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { CarrerDto } from 'src/app/dto/carrer.dto';
import { TeacherService } from 'src/app/service/teacher.service';
import { UserService } from 'src/app/service/user.service';
import { DepartmentDto } from 'src/app/dto/department.dto';
import * as XLSX from 'xlsx';


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
  total: number = 0;



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
        this.total = data.totalElements;
        this.listaElementos = this.generateMockData(this.total);
        this.students = this.students.map((student: any) => {
          if (student.uuidFoto == "") {
            student.uuidFoto = "./assets/icons/usuario.png";
          }
          return student;
        });
        console.log(this.students);
        this.fin = (this.inputValue2 * this.paginaActual) + 1
        if(this.fin > this.total){
          this.fin = this.total;
        }
        //agregar carnets y emails obtenido de data de estudiantes al emailSet y carnetsSet
        for (const student of this.students) {
          const carnetIdentidad = student.carnetIdentidad;
          const email = student.correo; 
          this.carnetsSet.add(carnetIdentidad);
          this.emailSet.add(email);
        }
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
    if(this.fin > this.total){
      this.fin = this.total;
    }

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
      for (const teacherData of data) {
        const carnetIdentidad = teacherData[3];
        const email = teacherData[5]; 
        const celular = teacherData[7];
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
        console.error('Se encontraron duplicados en los carnets de identidad, correos electrónicos o datos no válidos. No se pueden registrar docentes.');
      } else {
          data.forEach(teacherData => {
            console.log(teacherData);
            const nombre = teacherData[0]; 
            const apellidoPaterno = teacherData[1];
            const apellidoMaterno = teacherData[2]; 
            const carnetIdentidad = teacherData[3];
            const fechaNacimiento = teacherData[4];
            const correo = teacherData[5];
            const genero = teacherData[6];
            const celular = teacherData[7];
            const direccion = teacherData[8];
            const fechaRegistro = teacherData[9];
            const estadoCivil = teacherData[10];
            const username = teacherData[11];
            const secret = teacherData[12];
            const tipo = teacherData[13];
            const profesion = teacherData[14];
            const departamento = teacherData[15];
            const directorCarrera = teacherData[16];
            // Llama a tu función createTeacher del servicio con los datos del profesor.
            this.teacherService.createTeacher(
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
              tipo,
              profesion,
              departamento,
              directorCarrera
            ).subscribe(
              response => {
                console.log('Docente registrado con éxito', response);
              },
              error => {
                console.error('Error al registrar docente', error);
              }
            );
          });
          this.confirmationPopup = true;
        }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  pdfReport(student: any) {
    console.log(student);
  }

  // Función para exportar datos de docentes a Excel
  exportToExcel(): void {
    const fileName = 'teachers.xlsx';

    // Función para formatear la fecha en el formato deseado (8/10/2007)
    const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
    };
  
    // Seleccionar solo las propiedades deseadas (nombre, apellido paterno, etc)
    const selectedData = this.students.map(student => ({
      Nombre: student.nombre,
      ApellidoPaterno: student.apellidoPaterno,
      ApellidoMaterno: student.apellidoMaterno,
      CarnetIdentidad: student.carnetIdentidad,
      FechaNacimiento: formatDate(student.fechaNacimiento),
      Correo: student.correo,
      Genero: student.genero,
      Celular: student.celular,
      Direccion: student.direccion,
      FechaRegistro: formatDate(student.fechaRegistro),
      EstadoCivil: student.estadoCivil,
      Username: student.username,
      Tipo: student.tipo,
      Profesion: student.profesionId,
      Departamento: student.departamentoCarreraId,
      DirectorCarrera: student.directorCarrera

    }));
  
    // Convertir los datos seleccionados a una hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'teachers');
    XLSX.writeFile(wb, fileName);
  }
}
