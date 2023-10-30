import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUrl = `${environment.BACKEND_URL}/api/v1`;
  token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  public getUserInfo(): Observable<any>{
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.get<any>(`${this.userUrl}/user`, { headers: header });
  }

  public getOtherUserInfo(userId: string): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/user/${userId}`);
  } 

  public postLogin(email: string, password: string){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    const body = {
      'email': email,
      'password': password
    };
    return this.http.post(`${this.userUrl}/auth/`, body, { headers: header });
  }
  
  // Funcion para obtener lista de amigos
  public getFriends(userId: number) {
    return this.http.get(`${this.userUrl}/user/${userId}/friend`);
  }

  // Función para obtener notificaciones
  public getNotifications() {
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.get(`${this.userUrl}/user/friend/request`, { headers: header });
  }

  // Función para responder a una solicitud de amistad
  public respondFriendRequest(friendId: number, response: boolean){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    console.log(this.token);
    return this.http.put(`${this.userUrl}/user/friend/${friendId}/${response}`, null, { headers: header });
  }

  //Funcion para saber si son amigos o no
  public getFriendStatus(friendId: string){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.get(`${this.userUrl}/user/friend/${friendId}`, { headers: header });
  }

  // Función para agregar a un amigo
  public addFriend(friendId: string){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.post(`${this.userUrl}/user/friend/${friendId}`, null, { headers: header });
  }

  // Función para eliminar a un amigo
  public deleteFriend(friendId: number){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    return this.http.delete(`${this.userUrl}/user/friend/${friendId}`, { headers: header });
  }

  updateProfile(uuidFoto: string, uuidPortada: string, descripcion:string){
    const header = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
    const body = {
      "descripcion": descripcion,
      "uuidFoto": uuidFoto,
      "uuidPortada": uuidPortada
    }
    return this.http.put(`${this.userUrl}/user/profile`, body, { headers: header });
  }
}
