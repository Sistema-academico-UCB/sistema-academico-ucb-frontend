export interface NotificationDto {
    notificationId: number;
    emisorId: number,
    receptorId: number,
    mensaje: String,
    fechaEnvio: Date,
    estatus: Boolean
}