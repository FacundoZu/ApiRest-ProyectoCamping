import { Schema, model } from 'mongoose';

const ESTADO = ['pendiente', 'confirmada', 'rechazada', 'completada', 'cancelada'];

const ReservationSchema = new Schema({
    usuarioId: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
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
    //paymentId: {
    //    type: Schema.Types.ObjectId,
    //    ref: 'Payment'
    //}
});

export default model('Reserva', ReservationSchema, "reservas");
