import { Component } from '@angular/core';

@Component({
  selector: 'app-list-of-friends',
  templateUrl: './list-of-friends.component.html',
  styleUrls: ['./list-of-friends.component.css']
})
export class ListOfFriendsComponent {
  
  ngOnInit(){
    this.friends=this.friends
  }

  friends = [
    {
      userId: 1,
      Nombre: 'Gonzalo',
      Apellido: 'Choque',
      Carrera: 'Sistemas'
    },
    {
      userId: 2,
      Nombre: 'Valeria',
      Apellido: 'Paredez',
      Carrera: 'Civil'
    }
  ];

  //Logica para el popup
  isDialogVisible = false;

  openConfirmationDialog() {
    this.isDialogVisible = true;
  }

  confirmDelete() {
    // Realiza la eliminación aquí
    console.log('Elemento eliminado');
    this.isDialogVisible = false; // Cierra el cuadro de diálogo
  }

  cancelDelete() {
    // Cancela la eliminación aquí
    console.log('Eliminación cancelada');
    this.isDialogVisible = false; // Cierra el cuadro de diálogo
  }

}
