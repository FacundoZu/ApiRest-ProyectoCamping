import { Schema, model } from 'mongoose';

const ESTADO = ['pendiente', 'confirmada', 'rechazada', 'completada', 'cancelada'];
const METODOPAGO = ['tarjeta_credito', 'tarjeta_debito', 'transferencia'];

const ReservationSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    cabaniaId: {
        type: Schema.Types.ObjectId,
        ref: 'Cabania',
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFinal: {
        type: Date,
        required: true
    },
    precioTotal: {
        type: Number,
        required: true
    },
    estadoReserva: {
        type: String,
        enum: ESTADO,
        default: 'pendiente',
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    guestInfo: {
        nombre: String,
        email: String,
        telefono: String
    },
    metodoPago: {
        type: String,
        enum: METODOPAGO,
        required: true,
    },
    payment: {
        type: Schema.Types.ObjectId,
        ref: 'Payment'
    }
});

export default model('Reserva', ReservationSchema, "reservas");
