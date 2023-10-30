import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { AwsService } from 'src/app/service/aws.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})

export class ProfileEditComponent {
  
  // Constructor
  constructor(private userService: UserService, private awsService: AwsService) {}

  // Controlador para el mensaje de error
  @ViewChild('errorMessage') errorMessage!: ElementRef;
  // Controladores para la descripcion
  @ViewChild('Description') Description!: ElementRef;

  // Datos del usuario
  user = { 
    name: '', 
    username: '', 
    email: '', 
    register: '', 
    uuidFoto: '', 
    uuidPortada: '', 
    description: ''};
  auxUuidFoto = ''; // Auxiliar para el uuid de la foto
  auxUuidPortada = ''; // Auxiliar para el uuid de la portada

  // Variables
  txtDescription: string = this.user.description; // Descripción del usuario
  confirmationPopup = false; // Popup de confirmación
  errorPopup = false; // Popup de error

  // Obtiene la información del usuario al cargar la página
  ngOnInit(){
    console.log("Obteniendo información del usuario");
    this.userService.getUserInfo()
    .subscribe({
      next:data => {
        console.log(data);
        if (data.data.uuidFoto == ''){
          this.user.uuidFoto = '../../../assets/icons/usuario.png';
          this.auxUuidFoto = '../../../assets/icons/usuario.png';
        } else {
          this.user.uuidFoto = data.data.uuidFoto;
          this.auxUuidFoto = data.data.uuidFoto;
        }
        if (data.data.uuidPortada == ''){
          this.user.uuidPortada = '../../../assets/icons/portada-arboles.jpg';
          this.auxUuidPortada = '../../../assets/icons/portada-arboles.jpg';
        } else {
          this.user.uuidPortada = data.data.uuidPortada;
          this.auxUuidPortada = data.data.uuidPortada;
        }
        this.user.description = data.data.descripcion;
        this.txtDescription = this.user.description;
    },
    error: (error) => console.log(error),
  })
  }

  // Campos para las fotos
  selectedPfp: File;
  selectedHeader: File;
  onFileSelectedPfp(event: any) {
    this.selectedPfp = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result != null){
        this.user.uuidFoto = reader.result?.toString();
        console.log(this.user.uuidFoto);
      }
    };
    reader.readAsDataURL(this.selectedPfp);
  }
  onFileSelectedHeader(event: any) {
    this.selectedHeader = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result != null){
        this.user.uuidPortada = reader.result?.toString();
        console.log(this.user.uuidPortada);
      }
    };
    reader.readAsDataURL(this.selectedHeader);
  }

  // Función para guardar los datos
  guardarDatos(){
    if(this.validacion()) {
      if (this.user.uuidFoto == this.auxUuidFoto) {
        if (this.user.uuidPortada == this.auxUuidPortada) {
          this.userService.updateProfile(this.user.uuidFoto, this.user.uuidPortada, this.txtDescription).subscribe({
            next: data => {
              console.log(data);
              this.confirmationPopup = true;
            },
            error: error => {
              console.log(error);
              this.errorPopup = true;
            }
          });
        } else {
          if (this.auxUuidPortada == "../../../assets/icons/portada-arboles.jpg"){
            this.awsService.uploadFile(this.user.uuidPortada).subscribe({
              next: (data) => {
                console.log(data);
                this.user.uuidPortada = data.uploadResult.Location;
                this.userService.updateProfile(this.user.uuidFoto, this.user.uuidPortada, this.txtDescription).subscribe({
                  next: data => {
                    console.log(data);
                    this.confirmationPopup = true;
                  },
                  error: error => {
                    console.log(error);
                    this.errorPopup = true;
                  }
                });
              },
            });
          } else {
            let fileName = this.auxUuidPortada.split("/").pop();
            console.log(fileName);
            if (fileName != null) {
              this.awsService.deleteFile(fileName).subscribe({
                next: (data) => {
                  console.log(data);
                  this.awsService.uploadFile(this.user.uuidPortada).subscribe({
                    next: (data) => {
                      console.log(data);
                      this.user.uuidPortada = data.uploadResult.Location;
                      this.userService.updateProfile(this.user.uuidFoto, this.user.uuidPortada, this.txtDescription).subscribe({
                        next: data => {
                          console.log(data);
                          this.confirmationPopup = true;
                        },
                        error: error => {
                          console.log(error);
                          this.errorPopup = true;
                        }
                      });
                    },
                  });
                },
              });
            }
          }
        }
      } else {
        if (this.auxUuidFoto == "../../../assets/icons/usuario.png") {
          this.awsService.uploadFile(this.user.uuidFoto).subscribe({
            next: (data) => {
              console.log(data);
              this.user.uuidFoto = data.uploadResult.Location;
              if (this.user.uuidPortada == this.auxUuidPortada) {
                this.userService.updateProfile(this.user.uuidFoto, this.user.uuidPortada, this.txtDescription).subscribe({
                  next: data => {
                    console.log(data);
                    this.confirmationPopup = true;
                  },
                  error: error => {
                    console.log(error);
                    this.errorPopup = true;
                  }
                });
              } else {
                if (this.auxUuidPortada == "../../../assets/icons/portada-arboles.jpg"){
                  this.awsService.uploadFile(this.user.uuidPortada).subscribe({
                    next: (data) => {
                      console.log(data);
                      this.user.uuidPortada = data.uploadResult.Location;
                      this.userService.updateProfile(this.user.uuidFoto, this.user.uuidPortada, this.txtDescription).subscribe({
                        next: data => {
                          console.log(data);
                          this.confirmationPopup = true;
                        },
                        error: error => {
                          console.log(error);
                          this.errorPopup = true;
                        }
                      });
                    },
                  });
                } else {
                  let fileName = this.auxUuidPortada.split("/").pop();
                  console.log(fileName);
                  if (fileName != null) {
                    this.awsService.deleteFile(fileName).subscribe({
                      next: (data) => {
                        console.log(data);
                        this.awsService.uploadFile(this.user.uuidPortada).subscribe({
                          next: (data) => {
                            console.log(data);
                            this.user.uuidPortada = data.uploadResult.Location;
                            this.userService.updateProfile(this.user.uuidFoto, this.user.uuidPortada, this.txtDescription).subscribe({
                              next: data => {
                                console.log(data);
                                this.confirmationPopup = true;
                              },
                              error: error => {
                                console.log(error);
                                this.errorPopup = true;
                              }
                            });
                          },
                        });
                      },
                    });
                  }
                }
              }
            },
          });
        } else {
          let fileName = this.auxUuidFoto.split("/").pop();
          console.log(fileName);
          if (fileName != null) {
            this.awsService.deleteFile(fileName).subscribe({
              next: (data) => {
                console.log(data);
                this.awsService.uploadFile(this.user.uuidFoto).subscribe({
                  next: (data) => {
                    console.log(data);
                    this.user.uuidFoto = data.uploadResult.Location;
                    if (this.user.uuidPortada == this.auxUuidPortada) {
                      this.userService.updateProfile(this.user.uuidFoto, this.user.uuidPortada, this.txtDescription).subscribe({
                        next: data => {
                          console.log(data);
                          this.confirmationPopup = true;
                        },
                        error: error => {
                          console.log(error);
                          this.errorPopup = true;
                        }
                      });
                    } else {
                      if (this.auxUuidPortada == "../../../assets/icons/portada-arboles.jpg"){
                        this.awsService.uploadFile(this.user.uuidPortada).subscribe({
                          next: (data) => {
                            this.user.uuidPortada = data.uploadResult.Location;
                            this.userService.updateProfile(this.user.uuidFoto, this.user.uuidPortada, this.txtDescription).subscribe({
                              next: data => {
                                console.log(data);
                                this.confirmationPopup = true;
                              },
                              error: error => {
                                console.log(error);
                                this.errorPopup = true;
                              }
                            });
                          },
                        });
                      } else {
                        let fileName = this.auxUuidPortada.split("/").pop();
                        console.log(fileName);
                        if (fileName != null) {
                          this.awsService.deleteFile(fileName).subscribe({
                            next: (data) => {
                              console.log(data);
                              this.awsService.uploadFile(this.user.uuidPortada).subscribe({
                                next: (data) => {
                                  console.log(data);
                                  this.user.uuidPortada = data.uploadResult.Location;
                                  this.userService.updateProfile(this.user.uuidFoto, this.user.uuidPortada, this.txtDescription).subscribe({
                                    next: data => {
                                      console.log(data);
                                      this.confirmationPopup = true;
                                    },
                                    error: error => {
                                      console.log(error);
                                      this.errorPopup = true;
                                    }
                                  });
                                },
                              });
                            },
                          });
                        }
                      }
                    }
                  },
                });
              },
            });
          }
        }
      }
    }
  }

  /*Mensaje error*/
  mensajeError() {
    this.errorMessage.nativeElement.classList.add('warning-active');
    setTimeout(() => {
      this.errorMessage.nativeElement.classList.remove('warning-active');
    }, 2500);
  }
  /*Validacion*/
  validacion() {
    let flag = false;
    if (this.txtDescription == "") {
      this.mensajeError();
    } else {
      flag = true;
    }
    return flag;
  }
}
