import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnswerDto } from 'src/app/dto/answer.dto';
import { PublicationDto } from 'src/app/dto/publication.dto';
import { UserDto } from 'src/app/dto/user.dto';
import { PublicationService } from 'src/app/service/publication.service';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(
    private userService: UserService, 
    private router: Router, 
    private publicationService: PublicationService,
    private datePipe: DatePipe
    ) {
    const rol = localStorage.getItem('rol');
    if(rol == 'ADMIN') {
      window.alert('No tienes permisos para acceder a esta página');
      this.router.navigate(['/admin-menu']);
    } else if (rol == 'DOCENTE' || rol == 'ESTUDIANTE') {
      console.log('Acceso concedido');
    } else {
      window.alert('No has iniciado sesión');
      this.router.navigate(['/login']);
    }
  }

  user: UserDto = {} as UserDto;
  friendsList: UserDto[] = []; 
  publicationList: PublicationDto[] = [
    {
      publicacionId: 1,
      userId: 1,
      descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisl euismod, aliquam nunc vitae, aliquam nisl. Sed vitae nisl euismod, aliquam nunc vitae, aliquam nisl.',
      fecha: '2021-10-10T00:00:00.000Z',
      estado: true,
      respuestas: [
        {
          respuestaId: 1,
          userId: 2,
          publicacionId: 1,
          descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisl euismod, aliquam nunc vitae, aliquam nisl. Sed vitae nisl euismod, aliquam nunc vitae, aliquam nisl.',
          fecha: '2021-10-10T00:00:00.000Z',
          estado: true
        },
        {
          respuestaId: 2,
          userId: 3,
          publicacionId: 1,
          descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae nisl euismod, aliquam nunc vitae, aliquam nisl. Sed vitae nisl euismod, aliquam nunc vitae, aliquam nisl.',
          fecha: '2021-10-10T00:00:00.000Z',
          estado: true
        }
      ]
    }
  ];
  countFriends: number = 0;
  firstOption: boolean = true;
  secondOption: boolean = false;
  thirdOption: boolean = false;
  name: string = '';

  ngOnInit(){
    const nameLocal = localStorage.getItem('name');
    if (nameLocal) {
      this.name = nameLocal;
    }
    const uuidFotoLocal = localStorage.getItem('uuidFoto');
    if (uuidFotoLocal) {
      this.user.uuidFoto = uuidFotoLocal;
    }
    console.log("Obteniendo información del usuario");
    this.userService.getUserInfo()
    .subscribe({
      next:data => {
        console.log(data.data);
        if (data.data.uuidFoto != ''){
          this.user.uuidFoto = data.data.uuidFoto;
        } else {
          this.user.uuidFoto = '../../../assets/icons/usuario.png';
        }
        if (data.data.uuidPortada != ''){
          this.user.uuidPortada = data.data.uuidPortada;
        } else {
          this.user.uuidPortada = '../../../assets/icons/portada-arboles.jpg';
        }
        this.user.userId = data.data.userId;
        this.user.username = data.data.username;
        this.user.nombre = data.data.nombre;
        this.user.apellidoPaterno = data.data.apellidoPaterno;
        this.user.apellidoMaterno = data.data.apellidoMaterno;
        const nombre = localStorage.getItem('name');
        if(!nombre) {
          this.name = this.user.nombre.split(' ')[0] + ' ' + this.user.apellidoPaterno;
          localStorage.setItem('name', this.name);
        }
        const uuid = localStorage.getItem('uuidFoto');
        if(!uuid) {
          localStorage.setItem('uuidFoto', this.user.uuidFoto);
        }
        this.user.rol = data.data.rol;
        this.user.correo = data.data.correo;
        this.user.descripcion = data.data.descripcion;
        this.user.genero = data.data.genero;
        this.user.fechaRegistro = this.formattedDate(data.data.fechaRegistro);
        this.userService.getFriends(this.user.userId).subscribe(
          (data: any) => {
            this.friendsList = data.data;
            this.countFriends = this.friendsList.length;
            console.log(data);
          }
        );
        /*this.publicationService.getAllPublications(this.user.userId).subscribe(
          (data: any) => {
            this.publicationList = data.data;
            this.publicationList.forEach(publication => {
              publication.fecha = this.formatoFecha(publication.fecha);
              if (publication.respuestas) {
                publication.respuestas.forEach(answer => {
                  answer.fecha = this.formatoFecha(answer.fecha);
                  this.obtenerInfoOtroPerfil(answer);
                });
              }
            });
          }
        );*/
        this.publicationList.forEach(publication => {
          publication.fecha = this.formatoFecha(publication.fecha);
          if (publication.respuestas) {
            publication.respuestas.forEach(answer => {
              answer.fecha = this.formatoFecha(answer.fecha);
              this.obtenerInfoOtroPerfil(answer);
            });
          }
        });
      },
      error: (error) => console.log(error),
    });
  }

  public formattedDate(originalDate: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const date = new Date(originalDate);
    return date.toLocaleDateString('es-ES', options);
  }

  firstOptionChange() {
    this.firstOption = true;
    this.secondOption = false;
    this.thirdOption = false;
  }

  secondOptionChange() {
    this.firstOption = false;
    this.secondOption = true;
    this.thirdOption = false;
  }

  thirdOptionChange() {
    this.firstOption = false;
    this.secondOption = false;
    this.thirdOption = true;
  }
 
  //----------------------------------------Publicaciones----------------------------------------
  publicacion: string = '';
  errorPost: boolean = false;
  errorMessage: string = '';

  postear() {
    if(this.publicacion == '') {
      this.errorMessage = "No puedes publicar un mensaje vacío";
      this.errorPost = true;
      setTimeout(() => {
        this.errorPost = false;
      }, 3000);
    } else {
      const newPost: PublicationDto = {
        userId: this.user.userId,
        descripcion: this.publicacion,
        fecha: new Date().toISOString(),
        estado: true
      } 
      /*this.publicationService.createPublication(newPost).subscribe(
        (data: any) => {
          if(data.success) {
            this.publicationList.unshift(data.data);
            this.publicacion = '';
          } else {
            errorMessage = "Ocurrion un error al crear la publicación";
          }
        }
      );*/
      this.publicationList.unshift(newPost);
    }
  }

  public formatoFecha(originalDate: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    const date = new Date(originalDate);
    return date.toLocaleDateString('es-ES', options);
  }

  obtenerInfoOtroPerfil(answer: AnswerDto) {
    this.userService.getOtherUserInfo(answer.userId.toString()).subscribe(
      (data: any) => {
        console.log(data);
        answer.nombre = data.data.nombre + ' ' + data.data.apellidoPaterno + ' ' + data.data.apellidoMaterno;
        answer.uuidFoto = data.data.uuidFoto;
      }
    );
  }

  isDialogVisible: boolean = false;
  publicationToDelete: PublicationDto = {} as PublicationDto;
  deleteFlag: boolean = false;

  deletePost(publication: PublicationDto) {
    this.isDialogVisible = true;
    this.publicationToDelete = publication;
  }

  confirmDelete() {
    this.deleteFlag = true;
    if(this.publicationToDelete.publicacionId) {
      /*this.publicationService.deletePublication(this.publicationToDelete.publicacionId).subscribe(
        (data: any) => {
          if(data.success) {
            this.publicationList = this.publicationList.filter(publication => publication.publicacionId != this.publicationToDelete.publicacionId);
            this.isDialogVisible = false;
            this.deleteFlag = false;
          } else {
            this.isDialogVisible = false;
            this.errorMessage = "Ocurrion un error al eliminar la publicación";
            this.errorPost = true;
            this.deleteFlag = false;
            setTimeout(() => {
              this.errorPost = false;
            }, 3000);
          }
        }
      );*/
      this.publicationList = this.publicationList.filter(publication => publication.publicacionId != this.publicationToDelete.publicacionId);
      this.isDialogVisible = false;
      this.deleteFlag = false;
    }
  }

  cancelDelete() {
    this.isDialogVisible = false;
    this.publicationToDelete = {} as PublicationDto;
  }
}
