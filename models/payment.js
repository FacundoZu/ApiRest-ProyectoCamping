import { Schema, model } from 'mongoose';

const METODOPAGO = ['tarjeta_credito', 'tarjeta_debito', 'transferencia'];
const ESTADOPAGO = ['pendiente', 'pagado', 'fallido'];

const PaymentSchema = new Schema({
    reservaId: {
        type: Schema.Types.ObjectId,
        ref: 'Reserva',
        required: true,
    },
    tipo: {
        type: String,
        enum: METODOPAGO,
        required: true,
    },
    precioTotal: {
        type: Number,
        required: true
    },
    estadoPago: {
        type: String,
        enum: ESTADOPAGO,
        default: 'pendiente',
        required: true,
    },
    transaccionId: {
        type: String,
        required: function () {
            return this.estadoPago === 'pagado';
        },
    },
    cuotas: {
        type: Number,
        required: function () {
            return this.tipo === 'tarjeta_credito';
        },
    },
    fechaPago: {
        type: Date,
        default: Date.now,
    },
});

export default model('Payment', PaymentSchema);
