export interface AnswerDto {
    respuestaId?: number,
    userId: number,
    publicacionId: number,
    descripcion: string,
    fecha: Date,
    estado: boolean,
    uuidFoto?: string,
    nombre?: string,
}