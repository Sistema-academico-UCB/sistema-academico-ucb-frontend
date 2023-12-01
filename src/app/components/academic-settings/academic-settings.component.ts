import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-academic-settings',
  templateUrl: './academic-settings.component.html',
  styleUrls: ['./academic-settings.component.css']
})
export class AcademicSettingsComponent {

  option: number = 1;

  constructor(private router: Router) {
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

}
