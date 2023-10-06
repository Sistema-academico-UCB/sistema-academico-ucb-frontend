import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  userUrl = `${environment.BACKEND_URL}/api/v1`;

  constructor(private http: HttpClient) { }

  public getUserInfo(userId: number): Observable<any>{
    //return this.http.get<any>(`${environment.USER_URL}/api/v1/user/`);
    return this.http.get<any>(`${this.userUrl}/student/${userId}`);
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
  
}
