import { Component, ElementRef, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import moment from 'moment';
import domToImage from 'dom-to-image';
import html2canvas from 'html2canvas'; 

@Component({
  selector: 'app-student-report',
  templateUrl: './student-report.component.html',
  styleUrls: ['./student-report.component.css']
})
export class StudentReportComponent {
  @ViewChild('dataToExport', { static: false }) public dataToExport: ElementRef;
  pdfName = { value: 'Prueba' };
  estudiante = {
    "estudianteId": 2,
    "nombre": "Kevin",
    "apellidoPaterno": "Perez",
    "apellidoMaterno": "Lopez",
    "carnetIdentidad": "1234567",
    "fechaNacimiento": "31-12-1998",
    "correo": "juan.perez@ucb.edu.bo",
    "genero": "Hombre",
    "celular": "1234567",
    "direccion": "Calle 1",
    "fechaRegistro": "11-10-2023",
    "estadoCivil": "Soltero/a",
    "username": "juan.perez",
    "secret": "123456",
    "semestre": 1,
    "carrera": "IS - Ingeniería de Sistemas"
  }

  downloadAsPdf() {
    const width = this.dataToExport.nativeElement.clientWidth;
    const height = this.dataToExport.nativeElement.clientHeight + 40;
    let orientation = '';
    let imageUnit = 'pt';
    if (width > height) {
      orientation = 'l';
    } else {
      orientation = 'p';
    }
    domToImage
      .toJpeg(this.dataToExport.nativeElement, {
        quality: 1,
      })
      .then(result => {
        let jsPdfOptions = {
          orientation: orientation,
          unit: imageUnit,
          format: [width + 50, height + 220]
        } as any;
        const pdf = new jsPDF(jsPdfOptions);
        pdf.setFontSize(48);
        pdf.setTextColor('#2585fe');
        pdf.text(this.pdfName.value ? this.pdfName.value.toUpperCase() : 'Untitled dashboard'.toUpperCase(), 25, 75);
        pdf.setFontSize(24);
        pdf.setTextColor('#131523');
        pdf.text('Report date: ' + moment().format('ll'), 25, 115);
        var img = new Image()
        img.src = 'assets/icons/image.png'
        pdf.addImage(img, 'PNG', 25, 125, 100, 100);
        pdf.addImage(result, 'JPG', 25, 185, width, height);
        pdf.save('file_name' + '.pdf');
      })
      .catch(error => {
      });
    }
    public captureScreen()  
  {  
      //Id of the table
    html2canvas(this.dataToExport.nativeElement).then(canvas => {  
      // Few necessary setting options  
      let imgWidth = 350;   
      let pageHeight = 295;    
      let imgHeight = canvas.height * imgWidth / canvas.width;  
      let heightLeft = imgHeight;  

      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      let position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 10,10, imgWidth, imgHeight)  
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });  
  }  
  }
