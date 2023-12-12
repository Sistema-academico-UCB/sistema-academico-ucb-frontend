import { Component } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDto } from 'src/app/dto/user.dto';
import * as jwt_decode from 'jwt-decode';
import { PublicationDto } from 'src/app/dto/publication.dto';
import { PublicationService } from 'src/app/service/publication.service';
import { AnswerDto } from 'src/app/dto/answer.dto';
import { format } from 'date-fns';

@Component({
  selector: 'app-external-profile',
  templateUrl: './external-profile.component.html',
  styleUrls: ['./external-profile.component.css']
})

export class ExternalProfileComponent {
  
  id: string | null;
  myId: string = '';

  constructor(
    private userService: UserService, 
    private route: ActivatedRoute, 
    private router: Router,
    private publicationService: PublicationService
    ) {
    const rol = localStorage.getItem('rol');
    if(rol == 'ADMIN') {
      window.alert('No tienes permisos para acceder a esta página');
      this.router.navigate(['/admin-menu']);
    } else if (rol == 'DOCENTE' || rol == 'ESTUDIANTE') {
      this.route.params.subscribe(params => {
        this.id = params['user'];
      });
      const token = localStorage.getItem('token');
      if (token) {
        const sub = this.getSub(token).toUpperCase();
        if (sub == this.id) {
          this.router.navigate(['/profile']);
        }
        this.myId = sub;
      }
    } else {
      window.alert('No has iniciado sesión');
      this.router.navigate(['/login']);
    }
  }

  getSub(token: string) {
    try {
      const payload: any = jwt_decode.default(token);
      if (payload && payload.sub) {
        return payload.sub;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al decodificar el token JWT', error);
      return null;
    }
  }

  user: UserDto = {} as UserDto;
  friendsList: UserDto[] = []; 
  countFriends: number = 0;
  typeFriend: number = 0;
  name: string = '';
  uuidFoto: string = '';
  firstOption: boolean = true;
  secondOption: boolean = false;
  thirdOption: boolean = false;
  publicationList: PublicationDto[] = [];

  ngOnInit(){
    const nameLocal = localStorage.getItem('name');
    if (nameLocal) {
      this.name = nameLocal;
    }
    const uuidFotoLocal = localStorage.getItem('uuidFoto');
    if (uuidFotoLocal) {
      this.uuidFoto = uuidFotoLocal;
    }
    if (this.id != null) {
      this.userService.getOtherUserInfo(this.id).subscribe(
        (data: any) => {
          console.log(data);
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
          this.getPublicationList();
        }
      );
      this.userService.getFriendStatus(this.id).subscribe(
        (data: any) => {
          console.log(data);
          this.typeFriend = data.data;
        });
    }
  }

  getPublicationList() {
    this.publicationService.getAllPublications(this.user.userId).subscribe(
      (data: any) => {
        this.publicationList = data.data;
        this.publicationList.forEach(publication => {
          this.respuesta.push('');
          this.errorPost.push(false);
          this.errorMessage.push('');
          if (publication.respuesta) {
            publication.respuesta.forEach(answer => {
              this.obtenerInfoOtroPerfil(answer);
            });
          }
        });
      }
    );
    this.publicationList.forEach(publication => {
      this.respuesta.push('');
      this.errorPost.push(false);
      this.errorMessage.push('');
      if (publication.respuesta) {
        publication.respuesta.forEach(answer => {
          this.obtenerInfoOtroPerfil(answer);
        });
      }
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

  public addFriend() {
    if(this.id != null){
      this.userService.addFriend(this.id).subscribe(
        (data: any) => {
          console.log(data);
          this.typeFriend = 3;
        }
      );
    }
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

  //----------------------------------------Respuestas----------------------------------------
  respuesta: string[] = [];
  errorPost: boolean[] = [];
  errorMessage: string[] = [];

  postear(publicacion: PublicationDto, index: number) {
    if(this.respuesta[index] == '') {
      this.errorMessage[index] = "No puedes publicar una respuesta vacía.";
      this.errorPost[index] = true;
      setTimeout(() => {
        this.errorPost[index] = false;
      }, 3000);
    } else {
      if (publicacion.publicacionId) {
        const newAnswer: AnswerDto = {
          userId: Number(this.myId),
          publicacionId: publicacion.publicacionId,
          descripcion: this.respuesta[index],
          fecha: new Date(),
          estado: true
        };
        this.publicationService.createAnswer(newAnswer).subscribe(
          (data: any) => {
            if(data.success) {
              this.getPublicationList();
            } else {
              this.errorMessage[index] = "Ocurrion un error al publicar la respuesta.";
              this.errorPost[index] = true;
              setTimeout(() => {
                this.errorPost[index] = false;
              }, 3000);
            }
          }
        );
        this.obtenerInfoOtroPerfil(newAnswer);
        publicacion.respuesta?.unshift(newAnswer);
        this.respuesta[index] = '';
      }
    }
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
  answerToDelete: AnswerDto = {} as AnswerDto;
  deleteFlag: boolean = false;
  indexToDelete: number = 0;

  deleteAnswer(publication: PublicationDto, answer: AnswerDto, index: number) {
    this.isDialogVisible = true;
    this.publicationToDelete = publication;
    this.answerToDelete = answer;
    this.indexToDelete = index;
  }

  confirmDelete() {
    this.deleteFlag = true;
    if(this.answerToDelete.respuestaId) {
      this.publicationService.deleteAnswer(this.answerToDelete.respuestaId).subscribe(
        (data: any) => {
          if(data.success) {
            this.publicationToDelete.respuesta = this.publicationToDelete.respuesta?.filter(answer => answer.respuestaId != this.answerToDelete.respuestaId);
            this.isDialogVisible = false;
            this.deleteFlag = false;
            this.indexToDelete = 0;
          } else {
            this.isDialogVisible = false;
            this.errorMessage[this.indexToDelete] = "Ocurrió un error al eliminar la publicación";
            this.errorPost[this.indexToDelete] = true;
            this.deleteFlag = false;
            setTimeout(() => {
              this.errorPost[this.indexToDelete] = false;
              this.indexToDelete = 0;
            }, 3000);
          }
        }
      );
      this.publicationToDelete.respuesta = this.publicationToDelete.respuesta?.filter(answer => answer.respuestaId != this.answerToDelete.respuestaId);
      this.isDialogVisible = false;
      this.deleteFlag = false;
    }
  }

  cancelDelete() {
    this.isDialogVisible = false;
    this.answerToDelete = {} as AnswerDto;
  }
}
