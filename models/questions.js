import { Schema, model } from 'mongoose';

const QuestionsSchema = new Schema({
    pregunta: {
        type: String,
        required: true,
        unique: true
    },
    respuesta: {
        type: String,
        required: false,
        maxlength: 600
    },
    estado: {
        type: String,
        required: true,
        enum: ['Habilitado','Deshabilitado'],
        default: 'Deshabilitado'
    },
});

export default model('Pregunta', QuestionsSchema, "preguntas");