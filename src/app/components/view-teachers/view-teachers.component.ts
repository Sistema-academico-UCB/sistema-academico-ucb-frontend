import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { CarrerDto } from 'src/app/dto/carrer.dto';
import { TeacherService } from 'src/app/service/teacher.service';
import { UserService } from 'src/app/service/user.service';
import { DepartmentDto } from 'src/app/dto/department.dto';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TeacherDto } from 'src/app/dto/teacher.dto';


@Component({
  selector: 'app-view-teachers',
  templateUrl: './view-teachers.component.html',
  styleUrls: ['./view-teachers.component.css']
})
export class ViewTeachersComponent {
  carrers: CarrerDto[] = [];
  selectedCarrerValue: string = '-1';
  searchStudent = new FormControl();
  teachers: any[] = [];
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
    const rol = localStorage.getItem('rol');
    if(rol == 'ADMIN') {
      console.log('Acceso concedido');
    } else if (rol == 'DOCENTE' || rol == 'ESTUDIANTE') {
      window.alert('No tienes permisos para acceder a esta página');
      this.router.navigate(['/profile']);
    } else {
      window.alert('No has iniciado sesión');
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.changeSearchStudent();
    this.changePage(this.inputValue1 - 1, this.inputValue2, '', '', '');
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
  changePage(page: number, pageSize: number, searchText: string, searchCI: string, departamentoCarreraId: any) {
    console.log(page, pageSize, searchText, departamentoCarreraId)
    this.teacherService.getTeachers(page, pageSize, searchText, searchCI, departamentoCarreraId).subscribe(
      (data: any) => {
        this.teachers = data.data;
        this.total = data.totalElements;
        this.listaElementos = this.generateMockData(this.total);
        this.teachers = this.teachers.map((student: any) => {
          if (student.uuidFoto == "") {
            student.uuidFoto = "./assets/icons/usuario.png";
          }
          return student;
        });
        console.log(this.teachers);
        this.fin = (this.inputValue2 * this.paginaActual) + 1
        if (this.fin > this.total) {
          this.fin = this.total;
        }
        //agregar carnets y emails obtenido de data de estudiantes al emailSet y carnetsSet
        for (const student of this.teachers) {
          const carnetIdentidad = student.carnetIdentidad;
          const email = student.correo;
          this.carnetsSet.add(carnetIdentidad);
          this.emailSet.add(email);
        }
      }
    );
  }

  // Función para redirigir a la página de añadir estudiante
  addStudent() {
    this.router.navigate(['add-teacher']);
  }

  // Función para redirigir a la página de editar estudiante
  editTeacher(studentId: number) {
    this.router.navigate(['teacher-edit', studentId]);
  }

  // Función para redirigir a la página de eliminar estudiante
  deleteTeacher(studentId: number) {
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
          ? this.teachers.filter(student => student.name.toLowerCase().includes(this.searchText.toLowerCase()))
          : this.teachers;
        // Llamar al servicio para buscar estudiantes
        //this.changePage();
      }
    );
  }
  inputValue1: number = 1;
  inputValue2: number = 10;
  inputValue3: any ='';


  onInputChange() {
    console.log('Numero de la pagina', this.inputValue1);
    console.log('Tamaño de los datos', this.inputValue2);
    console.log('Carnet de identidad', this.searchText);
    console.log('Carrera', this.selectedCarrerValue)
    console.log('Departemento', this.inputValue3)

    this.inicio = (this.inputValue2 * (this.paginaActual - 1)) + 1;
    this.fin = (this.inputValue2 * this.paginaActual) + 1
    if (this.fin > this.total) {
      this.fin = this.total;
    }

    this.changePage(this.inputValue1 - 1, this.inputValue2, this.searchText, this.searchCI, this.inputValue3);

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
          const teacher: TeacherDto = {
            nombre: teacherData[0],
            apellidoPaterno: teacherData[1],
            apellidoMaterno: teacherData[2],
            carnetIdentidad: teacherData[3],
            fechaNacimiento: teacherData[4],
            correo: teacherData[5],
            genero: teacherData[6],
            celular: teacherData[7],
            direccion: teacherData[8],
            fechaRegistro: teacherData[9],
            estadoCivil: teacherData[10],
            username: teacherData[11],
            secret: teacherData[12],
            tipo: teacherData[13],
            profesionId: teacherData[14],
            departamentoCarreraId: teacherData[15],
            directorCarrera: teacherData[16],
            descripcion: "",
            rol: "Docente",
            uuidFoto: "../../../assets/icons/usuario.png",
            uuidPortada: "../../../assets/icons/portada-arboles.jpg",
            estado: true
          };
          // Llama a tu función createTeacher del servicio con los datos del profesor.
          this.teacherService.createTeacher(teacher).subscribe(
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

  pdfReport(teacher: any) {
    this.teacherService.getProfessionsById(teacher.profesionId).subscribe({
      next: (data: any) => {
        console.log(teacher);
        console.log(this.departamentos)
        const pdf = new jsPDF();

        // Agregar contenido al PDF
        pdf.addImage('assets/icons/image.png', 'PNG', 10, 10, 30, 20);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(30);
        pdf.setTextColor('#838383');
        pdf.text('Información del Docente', 50, 25);

        pdf.setFontSize(13);
        // pdf.setTextColor('#5F5F5F');
        // Datos del registro
        pdf.text('Datos del registro', 15, 40);
        autoTable(pdf, {
          theme: 'grid',
          startY: 45,
          head: [['ID Docente', 'Fecha de registro']],
          body: [[teacher.docenteId, this.formatearFecha(teacher.fechaRegistro)]],
        });

        // Datos personales
        pdf.text('Datos personales', 15, 70);
        autoTable(pdf, {
          theme: 'grid',
          startY: 75,
          head: [['Nombre', 'Apellido Paterno', 'Apellido Materno']],
          body: [[teacher.nombre, teacher.apellidoPaterno, teacher.apellidoMaterno]],
        });
        autoTable(pdf, {
          theme: 'grid',
          startY: 90,
          head: [['Carnet de Identidad', 'Fecha de nacimiento', 'Género']],
          body: [[teacher.carnetIdentidad, this.formatearFecha(teacher.fechaNacimiento), teacher.genero]],
        });
        autoTable(pdf, {
          theme: 'grid',
          startY: 105,
          head: [['Celular', 'Estado civil']],
          body: [[teacher.celular, teacher.estadoCivil]],
        });
        autoTable(pdf, {
          theme: 'grid',
          startY: 120,
          head: [['Dirección']],
          body: [[teacher.direccion]],
        });

        //Información de la cuenta
        pdf.text('Información de la cuenta', 15, 145);
        autoTable(pdf, {
          theme: 'grid',
          startY: 150,
          head: [['Correo electrónico']],
          body: [[teacher.correo]],
        });
        autoTable(pdf, {
          startY: 165,
          theme: 'grid',
          head: [['Nombre de usuario']],
          body: [[teacher.username]],
        });

        // Información del docente
        pdf.text('Información del docente', 15, 190);
        autoTable(pdf, {
          theme: 'grid',
          startY: 195,
          head: [['Tipo de docente', 'Profesión']],
          body: [[teacher.tipo, data.data.nombreProfesion]],
        });
        autoTable(pdf, {
          theme: 'grid',
          startY: 210,
          head: [['Departamento', 'Director de carrera']],
          body: [[this.searchDepartmentById(teacher.departamentoCarreraId), teacher.directorCarrera ? 'Sí' : 'No']],
        });

        // Guardar PDF con el nombre del estudiante, empezando por el apellido
        pdf.save(`${teacher.apellidoPaterno}_${teacher.apellidoMaterno}_${teacher.nombre}.pdf`);

      },
      error: (error: any) => {
        console.log(error);
      }
    });


  }
  searchDepartmentById(departmentId: number): string {
    const department = this.departamentos.find(department => department.carreraId === departmentId);
    return department ? department.nombre : '';
  }

  formatearFecha(fecha: string): string {
    const fechaFormateada = format(new Date(fecha), 'dd-MM-yyyy');
    return fechaFormateada;
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
    const selectedData = this.teachers.map(teacher => ({
      Nombre: teacher.nombre,
      ApellidoPaterno: teacher.apellidoPaterno,
      ApellidoMaterno: teacher.apellidoMaterno,
      CarnetIdentidad: teacher.carnetIdentidad,
      FechaNacimiento: formatDate(teacher.fechaNacimiento),
      Correo: teacher.correo,
      Genero: teacher.genero,
      Celular: teacher.celular,
      Direccion: teacher.direccion,
      FechaRegistro: formatDate(teacher.fechaRegistro),
      EstadoCivil: teacher.estadoCivil,
      Username: teacher.username,
      Tipo: teacher.tipo,
      Profesion: teacher.profesionId,
      Departamento: teacher.departamentoCarreraId,
      DirectorCarrera: teacher.directorCarrera

    }));

    // Convertir los datos seleccionados a una hoja de cálculo
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'teachers');
    XLSX.writeFile(wb, fileName);
  }
}
