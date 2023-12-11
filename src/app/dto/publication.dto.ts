import { AnswerDto } from "./answer.dto";

export interface PublicationDto {
    publicacionId?: number,
    userId: number,
    descripcion: string,
    fecha: string,
    estado: boolean,
    respuestas?: AnswerDto[]
}