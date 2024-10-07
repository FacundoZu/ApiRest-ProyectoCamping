import { Schema, model } from 'mongoose';

const ReservaSchema = new Schema({
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
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

export default model('Reserva', ReservacionSchema, "reservas");