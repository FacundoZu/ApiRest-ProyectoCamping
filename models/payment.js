import { Schema, model } from 'mongoose';

const METODOPAGO = ['tarjeta_credito', 'paypal', 'transferencia', 'efectivo'];
const ESTADOPAGO = ['pendiente', 'pagado', 'fallido'];

const PaymentSchema = new Schema({
    reservaId: {
        type: Schema.Types.ObjectId,
        ref: 'Reserva',
        required: true
    },
    tipo: {
        type: String,
        enum: METODOPAGO,
        required: true
    },
    estadoPago: {
        type: String,
        enum: ESTADOPAGO,
        default: 'pendiente',
        required: true
    },
    transaccionId: {
        type: String,
        required: function() {
            return this.estadoPago === 'pagado';
        }
    },
    fechaPago: {
        type: Date,
        default: Date.now
    }
});

export default model('Payment', PaymentSchema);
