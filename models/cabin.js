import { Schema, model } from 'mongoose';

// Definir las opciones de modelo y disponibilidad
const MODELO = ['Grande', 'Mediana', 'Pequeña'];
const DISPONIBILIDAD = ['Disponible', 'Ocupada', 'En mantenimiento'];

const CabaniaSchema = new Schema({
    imagen: {
        type: String, // Usar un string para guardar la URL de la imagen
        required: false
    },
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
    estado: {
        type: String,
        enum: DISPONIBILIDAD,
        default: 'Disponible',
        required: true
    }
});

// Método para cambiar el estado de la cabaña
CabaniaSchema.methods.cambiarEstado = function (nuevoEstado) {
    this.estado = nuevoEstado || 'Reservada';
    return this.save();
};

// Método para verificar si la cabaña está disponible en un rango de fechas
CabaniaSchema.methods.estaDisp = async function (checkin, checkout) {
    const reservas = await model('Reserva').find({ cabania_id: this._id });
    
    for (let reserva of reservas) {
        if ((checkin < reserva.end_date && checkout > reserva.start_date) ||
            (checkin > reserva.start_date && checkin < reserva.end_date)) {
            return false;
        }
    }
    
    return true;
};

// Método para obtener las fechas de las reservas
CabaniaSchema.methods.fechas = function () {
    return model('Reserva').find({ cabania_id: this._id });
};

export default model('Cabania', CabaniaSchema);