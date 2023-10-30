import { Component } from '@angular/core';
import { UserDto } from 'src/app/dto/user.dto';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-list-of-friends',
  templateUrl: './list-of-friends.component.html',
  styleUrls: ['./list-of-friends.component.css']
})
export class ListOfFriendsComponent {

  constructor(private userService: UserService) {
  }

  user: UserDto = {} as UserDto;
  friendsList: UserDto[] = []; 
  friendToDeleteId: number;
  name: string = '';
  uuidFoto: string = '';
  
  ngOnInit(){
    const nameLocal = localStorage.getItem('name');
    if (nameLocal) {
      this.name = nameLocal;
    }
    const uuidFotoLocal = localStorage.getItem('uuidFoto');
    if (uuidFotoLocal) {
      this.uuidFoto = uuidFotoLocal;
    }
    console.log("Obteniendo información del usuario");
    this.userService.getUserInfo()
    .subscribe({
      next:data => {
        console.log(data.data);
        this.user.userId = data.data.userId;
        this.userService.getFriends(this.user.userId).subscribe(
          (data: any) => {
            this.friendsList = data.data;
            console.log(data);
          }
        );
      },
      error: (error) => console.log(error),
    });
  }

  

  //Logica para el popup
  isDialogVisible = false;
  openConfirmationDialog(userId: number) {
    this.friendToDeleteId = userId; 
    this.isDialogVisible = true;
  }


  confirmDelete() {
    // Realiza la eliminación aquí
    if (this.friendToDeleteId) {
      // Realiza la eliminación utilizando this.friendToDeleteId
      console.log('Elemento eliminado:', this.friendToDeleteId);
      // Limpia el ID después de la eliminación
      this.userService.deleteFriend(this.friendToDeleteId).subscribe(
        (data: any) => {
          console.log(data);
          this.ngOnInit();
        }
      );
      this.friendToDeleteId = 0;


    }
    this.isDialogVisible = false; // Cierra el cuadro de diálogo
  }

  cancelDelete() {
    // Cancela la eliminación aquí
    console.log('Eliminación cancelada');
    this.isDialogVisible = false; // Cierra el cuadro de diálogo
  }

}
