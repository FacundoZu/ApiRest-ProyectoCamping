import { Schema, model } from 'mongoose';

const ServiceSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    imagen: {
        type: String,
        required: false,
        default: "https://cdn-icons-png.flaticon.com/128/8382/8382949.png"
    },
    descripcion: {
        type: String,
        required: false,
        maxlength: 200
    },
});

export default model('Servicio', ServiceSchema, "servicios");
