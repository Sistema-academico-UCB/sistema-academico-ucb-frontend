import { Component } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { TeacherService } from 'src/app/service/teacher.service';

@Component({
  selector: 'app-profile-teacher',
  templateUrl: './profile-teacher.component.html',
  styleUrls: ['./profile-teacher.component.css']
})
export class ProfileTeacherComponent {
  constructor(private userService: UserService, private TeacherService: TeacherService) {
  }

  user = {
    name: '',
    username: '',
    email: '',
    register: '',
    urlPfp: '../../../assets/icons/usuario.png',
    urlHeader: '../../../assets/icons/portada-arboles.jpg',
    description: ''
  };
  ngOnInit(){
    console.log("Obteniendo información del usuario");
    this.TeacherService.getTeacherInfo(1)
    .subscribe({
      next:data => {
        this.user.description=data.data.descripcion
        this.user.urlPfp=data.data.uuidFoto

        this.user.urlHeader=data.data.uuidPortada
        console.log(data.data)
    },
    error: (error) => console.log(error),
  })
  }

}
