import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, forkJoin } from 'rxjs';
import { CarrerDto } from 'src/app/dto/carrer.dto';
import { StudentService } from 'src/app/service/student.service';
import { UserService } from 'src/app/service/user.service';
import * as XLSX from 'xlsx';
import { StudentReportComponent } from '../student-report/student-report.component';
import { SharedService } from 'src/app/service/shared/shared.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns';
import { StudentDto } from 'src/app/dto/student.dto';
import { CollegeDto } from 'src/app/dto/college.dto';

@Component({
  selector: 'app-view-students',
  templateUrl: './view-students.component.html',
  styleUrls: ['./view-students.component.css']
})
export class ViewStudentsComponent {
  @ViewChild(StudentReportComponent, { static: false }) private studentReport: StudentReportComponent;

  carrers: CarrerDto[] = [];
  schools: CollegeDto[] = [];
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


  constructor(private router: Router, private studentService: StudentService, private userService: UserService, private sharedService: SharedService) {
    const rol = localStorage.getItem('rol');
    if(rol == 'ADMIN') {
      this.studentService.getCarrers().subscribe(
        (data: any) => {
          this.carrers = data.data;
        }
      );
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
    this.changePage(this.inputValue1 - 1, this.inputValue2, '', '', '', '');
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
    // Obtener la lista de colegios
    this.studentService.getColleges().subscribe(
      (data: any) => {
        this.schools = data.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Función para controlar los cambios del page y pageSize
  changePage(page: number, pageSize: number, searchText: string, searchCI: string, semestre: any, carrera: any) {
    console.log(page, pageSize, searchText, semestre)
    this.studentService.getStudents(page, pageSize, searchText, searchCI, semestre, carrera).subscribe(
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
        this.fin = (this.inputValue2 * this.paginaActual) + 1
        if (this.fin > this.total) {
          this.fin = this.total;
        }
        //agregar carnets y emails obtenido de data de estudiantes al emailSet y carnetsSet
        // for (const student of this.students) {
        //   const carnetIdentidad = student.carnetIdentidad;
        //   const email = student.correo; 
        //   this.carnetsSet.add(carnetIdentidad);
        //   this.emailSet.add(email);
        // }
      }
    );
  }

  // Función para redirigir a la página de añadir estudiante
  addStudent() {
    this.router.navigate(['add-student']);
  }

  // Función para redirigir a la página de editar estudiante
  editStudent(studentId: number) {
    this.router.navigate(['student-edit', studentId]);
  }

  // Función para redirigir a la página de eliminar estudiante
  deleteStudent(studentId: number) {
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
  inputValue3: any = '';
  inputValue4: any = '';


  onInputChange() {
    console.log('Numero de la pagina', this.inputValue1);
    console.log('Tamaño de los datos', this.inputValue2);
    console.log(this.inputValue3);
    console.log('Carnet de identidad', this.searchText);
    console.log(this.inputValue4);
    this.inicio = (this.inputValue2 * (this.paginaActual - 1)) + 1;
    this.fin = (this.inputValue2 * this.paginaActual) + 1
    if (this.fin > this.total) {
      this.fin = this.total;
    }

    this.changePage(this.inputValue1 - 1, this.inputValue2, this.searchText, this.searchCI, this.inputValue3, this.inputValue4);

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
  hasInvalidData = false;
  celularRegex = /^\d+$/; // Expresión regular para verificar que el campo celular solo contenga dígitos
  loadingPopup = false;
  errorPopup = false;
  errorMessage = "";

  onFileChange(event: any): void {

    // Función para formatear la fecha en el formato deseado (2001-08-07)
    const formatDate = (dateString: string): string => {
      const date = dateString.split('/');
      const year = date[2];
      const month = date[1];
      const day = date[0];
      return `${year}-${month}-${day}`;
    };

    this.loadingPopup = true;
    this.carnetsSet = new Set<string>();
    this.emailSet = new Set<string>();
    this.hasInvalidData = false;

    const target: DataTransfer = event.target as DataTransfer;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const sheetName: string = workbook.SheetNames[0];
      const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      let data: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      // Quitamos el encabezado
      data = data.slice(1);
      // Imprimimos los datos en la consola
      console.log(data);

      // Validaciones previas
      for (const studentData of data) {
        const carnetIdentidad = studentData[3];
        const email = studentData[5];
        const celular = studentData[7];
        // Validación para el carnet de identidad
        if (this.carnetsSet.has(carnetIdentidad)) {
          this.errorMessage = `El carnet de identidad ${carnetIdentidad} está duplicado.`;
          this.loadingPopup = false;
          this.hasInvalidData = true;
          break;
        } else {
          this.carnetsSet.add(carnetIdentidad);
        }

        // Validación para el correo electrónico
        if (this.emailSet.has(email)) {
          this.errorMessage = `El correo electrónico ${email} está duplicado.`;
          this.loadingPopup = false;
          this.hasInvalidData = true;
          break;
        } else {
          this.emailSet.add(email);
        }

        if (typeof celular === 'string' && !celular.match(this.celularRegex)) {
          this.errorMessage = `El número de celular ${celular} no es válido. Solo se permiten dígitos.`;
          this.loadingPopup = false;
          this.hasInvalidData = true;
          break;
        }

        const colegioId = this.schools.find(school => school.nombreColegio === studentData[13])?.colegioId;
        const carreraId = this.carreras.find(career => career.nombre === studentData[14])?.carreraId;
        if (!colegioId) {
          this.errorMessage = `El colegio ${studentData[13]} no existe.`;
          this.loadingPopup = false;
          this.hasInvalidData = true;
          break;
        }
        if (!carreraId) {
          this.errorMessage = `La carrera ${studentData[14]} no existe.`;
          this.loadingPopup = false;
          this.hasInvalidData = true;
          break;
        }

        // Verificar que las fechas de nacimiento y registro sean válidas
        if(typeof studentData[4] === 'string') {
          const auxiliar = studentData[4];
          studentData[4] = formatDate(studentData[4]);
          const fechaNacimiento = new Date(formatDate(studentData[4]));
          if (isNaN(fechaNacimiento.getTime())) {
            this.errorMessage = `La fecha de nacimiento ${auxiliar} no es válida.`;
            this.loadingPopup = false;
            this.hasInvalidData = true;
            break;
          }
        } else if (typeof studentData[4] === 'number'){
          const jsDate = this.excelDateToJSDate(studentData[4]);
          if (isNaN(jsDate.getTime())) {
            this.errorMessage = `La fecha de nacimiento ${studentData[4]} no es válida.`;
            this.loadingPopup = false;
            this.hasInvalidData = true;
            break;
          } else {
            studentData[4] = this.formatDateToYYYYMMDD(jsDate);
          }
        } else {
          this.errorMessage = `El formato de la fecha de nacimiento ${studentData[4]} no es válido.`;
          this.loadingPopup = false;
          this.hasInvalidData = true;
          break;
        }
        if(typeof studentData[9] === 'string') {
          const auxiliar = studentData[9];
          studentData[9] = formatDate(studentData[9]);
          const fechaRegistro = new Date(studentData[9]);
          if (isNaN(fechaRegistro.getTime())) {
            this.errorMessage = `La fecha de registro ${auxiliar} no es válida.`;
            this.loadingPopup = false;
            this.hasInvalidData = true;
            break;
          }
        } else if (typeof studentData[9] === 'number'){
          const jsDate = this.excelDateToJSDate(studentData[9]);
          if (isNaN(jsDate.getTime())) {
            this.errorMessage = `La fecha de registro ${studentData[9]} no es válida.`;
            this.loadingPopup = false;
            this.hasInvalidData = true;
            break;
          } else {
            studentData[9] = this.formatDateToYYYYMMDD(jsDate);
          }
        } else {
          this.errorMessage = `El formato de la fecha de registro ${studentData[9]} no es válido.`;
          this.loadingPopup = false;
          this.hasInvalidData = true;
          break;
        }
      }

      if (!this.hasInvalidData) {
        const observables = data.map(studentData => {
          const colegioId = this.schools.find(school => school.nombreColegio === studentData[13])?.colegioId || 1;
          const carreraId = this.carreras.find(career => career.nombre === studentData[14])?.carreraId || 1;
          const newStudent: StudentDto = {
            nombre: studentData[0],
            apellidoPaterno: studentData[1],
            apellidoMaterno: studentData[2],
            carnetIdentidad: studentData[3],
            fechaNacimiento: studentData[4],
            correo: studentData[5],
            genero: studentData[6],
            celular: studentData[7],
            descripcion: "",
            direccion: studentData[8],
            fechaRegistro: studentData[9],
            estadoCivil: studentData[10],
            username: studentData[11],
            secret: studentData[3],
            rol: "Estudiante",
            semestre: studentData[12],
            colegioId: colegioId,
            carreraId: carreraId,
            uuidFoto: "../../../assets/icons/usuario.png",
            uuidPortada: "../../../assets/icons/portada-arboles.jpg",
            estado: true
          };
          console.log(newStudent);
          return this.studentService.createStudent(newStudent);
        });
        forkJoin(observables).subscribe(
          (results: any[]) => {
            console.log(results); 
            this.onInputChange();
            this.loadingPopup = false;
            this.confirmationPopup = true;
          },
          (error) => {
            console.log(error);
            this.errorMessage = 'Error en una de las solicitudes HTTP';
            this.loadingPopup = false;
            this.errorPopup = true;
          }
        );
      }
    };
    reader.readAsBinaryString(target.files[0]);
    this.resetFileInput();
  }

  resetFileInput(): void {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }  

  excelDateToJSDate(excelDate: number): Date {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const excelEpoch = new Date(1899, 11, 30); // 1899-12-30 in JS Date format
    const offsetDays = excelDate - 1; // Excel uses 1-based index for dates

    return new Date(excelEpoch.getTime() + offsetDays * millisecondsPerDay);
  }

  formatDateToYYYYMMDD(jsDate: Date): string {
    const year = jsDate.getFullYear();
    const month = String(jsDate.getMonth() + 1).padStart(2, '0');
    const day = String(jsDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  pdfReport(student: any) {
    const pdf = new jsPDF();

    // Agregar contenido al PDF
    pdf.addImage('assets/icons/image.png', 'PNG', 10, 10, 30, 20);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(30);
    pdf.setTextColor('#838383');
    pdf.text('Información del Estudiante', 50, 25);

    pdf.setFontSize(13);
    // pdf.setTextColor('#5F5F5F');
    // Datos del registro
    pdf.text('Datos del registro', 15, 40);
    autoTable(pdf, {
      theme: 'grid',
      startY: 45,
      head: [['ID Estudiante', 'Fecha de registro']],
      body: [[student.estudianteId, this.formatearFecha(student.fechaRegistro)]],
    });

    // Datos personales
    pdf.text('Datos personales', 15, 70);
    autoTable(pdf, {
      theme: 'grid',
      startY: 75,
      head: [['Nombre', 'Apellido Paterno', 'Apellido Materno']],
      body: [[student.nombre, student.apellidoPaterno, student.apellidoMaterno]],
    });
    autoTable(pdf, {
      theme: 'grid',
      startY: 90,
      head: [['Carnet de Identidad', 'Fecha de nacimiento', 'Género']],
      body: [[student.carnetIdentidad, this.formatearFecha(student.fechaNacimiento), student.genero]],
    });
    autoTable(pdf, {
      theme: 'grid',
      startY: 105,
      head: [['Celular', 'Estado civil']],
      body: [[student.celular, student.estadoCivil]],
    });
    autoTable(pdf, {
      theme: 'grid',
      startY: 120,
      head: [['Dirección']],
      body: [[student.direccion]],
    });

    //Información de la cuenta
    pdf.text('Información de la cuenta', 15, 145);
    autoTable(pdf, {
      theme: 'grid',
      startY: 150,
      head: [['Correo electrónico']],
      body: [[student.correo]],
    });
    autoTable(pdf, {
      theme: 'grid',
      startY: 165,
      head: [['Nombre de usuario']],
      body: [[student.username]],
    });
    autoTable(pdf, {
      startY: 180,
      theme: 'grid',
      head: [['Semestre', 'Carrera']],
      body: [[student.semestre, this.searchCareerById(student.carreraId)]],
    });

    // Guardar PDF con el nombre del estudiante, empezando por el apellido
    pdf.save(`${student.apellidoPaterno}_${student.apellidoMaterno}_${student.nombre}.pdf`);
  }

  formatearFecha(fecha: string): string {
    const fechaFormateada = format(new Date(fecha), 'dd-MM-yyyy');
    return fechaFormateada;
  }
  searchCareerById(careerId: number): string {
    const career = this.carreras.find(career => career.carreraId === careerId);
    return career ? career.nombre : '';
  }

  //-----------------------------Exportar datos a Excel---------------------------------

  exportFlag: boolean = false;
  // Función para exportar datos de estudiantes a Excel
  exportToExcel(): void {
    this.exportFlag = true;
    const fileName = 'lista-estudiantes.xlsx';

    // Función para formatear la fecha en el formato deseado (8/10/2007)
    const formatDate = (dateString: string): string => {
      const date = dateString.split('T')[0];
      const dateParts = date.split('-');
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      return `${day}/${month}/${year}`;
    };

    if(this.total == 0) {
      // Exportar un excel solo con encabezados
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([{
        'Nombre(s)': '',
        'Apellido Paterno': '',
        'Apellido Materno': '',
        'Carnet de Identidad': '',
        'Fecha de Nacimiento': '',
        'Correo': '',
        'Género': '',
        'Celular': '',
        'Dirección': '',
        'Fecha de Registro': '',
        'Estado Civil': '',
        'Nombre de Usuario': '',
        'Semestre': '',
        'Colegio': '',
        'Carrera': ''
      }]);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'students');
      XLSX.writeFile(wb, fileName);
      this.exportFlag = false;
    } else {
      var studentsExcel: StudentDto[] = []; 
      this.studentService.getStudents(0, this.total, this.searchText, this.searchCI, this.inputValue3, this.inputValue4).subscribe(
        (data: any) => {
          console.log(data.data);
          studentsExcel = data.data;
          // Seleccionar solo las propiedades deseadas (nombre, apellido paterno, etc)
          const selectedData = studentsExcel.map(student => ({
            'Nombre(s)': student.nombre,
            'Apellido Paterno': student.apellidoPaterno,
            'Apellido Materno': student.apellidoMaterno,
            'Carnet de Identidad': student.carnetIdentidad,
            'Fecha de Nacimiento': formatDate(student.fechaNacimiento),
            'Correo': student.correo,
            'Género': student.genero,
            'Celular': student.celular,
            'Dirección': student.direccion,
            'Fecha de Registro': formatDate(student.fechaRegistro),
            'Estado Civil': student.estadoCivil,
            'Nombre de Usuario': student.username,
            'Semestre': student.semestre,
            'Colegio': this.schools.find(school => school.colegioId === student.colegioId)?.nombreColegio,
            'Carrera': this.carreras.find(career => career.carreraId === student.carreraId)?.nombre
          }));

          // Convertir los datos seleccionados a una hoja de cálculo
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'students');
          XLSX.writeFile(wb, fileName);
          this.exportFlag = false;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}