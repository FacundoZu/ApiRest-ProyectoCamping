import { Schema, model } from 'mongoose';

const MODELO = ['Grande', 'Mediana', 'Pequeña'];
const DISPONIBILIDAD = ['Disponible', 'En Mantenimiento', 'No Disponible', 'En Renovación'];

const CabaniaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        maxlength: 20
    },
    imagenPrincipal: {
        type: String,
        required: false,
        default: "https://imgs.search.brave.com/Xmn_DX1Sg_IKm222XB-QKwZOj--aJU_pEAB6lEBsuI4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/Y29uc3RydXllaG9n/YXIuY29tL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDE0LzExL0Rp/c2UlQzMlQjFvLWRl/LWNhYmElQzMlQjFh/LXBlcXVlJUMzJUIx/YS1kZS1jYW1wbzEu/anBn"
    },
    imagenes: [{
        type: String,
        required: false
    }],
    modelo: {
        type: String,
        enum: MODELO,
        default: '-',
        required: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    descripcion: {
        type: String,
        maxlength: 600,
        required: false
    },
    cantidadPersonas: {
        type: Number,
        min: 0,
        required: true
    },
    cantidadBaños: {
        type: Number,
        min: 0,
        required: true
    },
    cantidadHabitaciones: {
        type: Number,
        min: 0,
        required: true
    },
    minimoDias: {
        type: Number,
        min: 1,
        default: 1,
        required: true
    },
    estado: {
        type: String,
        enum: DISPONIBILIDAD,
        default: 'Disponible',
        required: true
    },
    servicios: [{
        type: Schema.Types.ObjectId,
        ref: 'Servicio'
    }],
    reservas: [{
        type: Schema.Types.ObjectId,
        ref: 'Reserva'
    }],
    comentarios: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
});

CabaniaSchema.statics.getModelos = function () {
    return ['Grande', 'Mediana', 'Pequeña'];
};

CabaniaSchema.statics.getDisponibilidades = function () {
    return ['Disponible', 'En Mantenimiento', 'No Disponible', 'En Renovación'];
};

export default model('Cabania', CabaniaSchema);