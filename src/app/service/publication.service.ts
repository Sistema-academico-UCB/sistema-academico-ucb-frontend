import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PublicationDto } from '../dto/publication.dto';
import { AnswerDto } from '../dto/answer.dto';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  publicationUrl = `${environment.BACKEND_URL}/api/v1`;

  constructor(private http: HttpClient) { }

  // Función para obtener todas las publicaciones de un usuario
  getAllPublications(userId: number) {
    return this.http.get<any>(`${this.publicationUrl}/publication/${userId}`);
  }

  // Función para crear una publicación
  createPublication(publication: PublicationDto) {
    return this.http.post<any>(`${this.publicationUrl}/publication`, publication);
  }

  // Función para eliminar una publicación
  deletePublication(id: number) {
    return this.http.delete<any>(`${this.publicationUrl}/publication/${id}`);
  }

  // Función para crear una respuesta
  createAnswer(answer: AnswerDto) {
    return this.http.post<any>(`${this.publicationUrl}/answer`, answer);
  }

  // Función para eliminar una respuesta
  deleteAnswer(id: number) {
    return this.http.delete<any>(`${this.publicationUrl}/answer/${id}`);
  }

}
