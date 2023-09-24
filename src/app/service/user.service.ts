import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getUserInfo(userId: number): Observable<any>{
    //return this.http.get<any>(`${environment.USER_URL}/api/v1/user/`);
    return this.http.get<any>(`http://localhost:8080/api/v1/student/${userId}`);
  }
}
