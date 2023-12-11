export interface AnswerDto {
    respuestaId?: number,
    userId: number,
    publicacionId: number,
    descripcion: string,
    fecha: string,
    estado: boolean,
    uuidFoto?: string,
    nombre?: string,
}