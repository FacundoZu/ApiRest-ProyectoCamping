import { Schema, model } from 'mongoose';

const ActivitiSchema = new Schema({
    titulo: {
        type: String,
        required: true,
        unique: true
    },
    imagen: {
        type: String,
        required: false,
        default: "https://cdn-icons-png.flaticon.com/128/5492/5492767.png"
    },
    descripcion: {
        type: String,
        required: false,
        maxlength: 600
    },
    fechaInicio: {
        type: Date,
        required: false
    },
    fechaFinal: {
        type: Date,
        required: false
    },
    estado: {
        type: String,
        required: true,
        enum: ['Habilitado','Deshabilitado'],
        default: 'Deshabilitado'
    },
});

export default model('Actividad', ActivitiSchema, "actividades");