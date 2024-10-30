import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jwt-simple';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

const UserSchema = new Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Solo requerido si no tiene googleId
      },
    },
    phone: {
      type: String
    },
    address: {
      type: String, // Agregado el campo de dirección
    },
    role: {
      type: String,
      enum: ['admin', 'gerente', 'cliente'],
      default: 'cliente'
    },
    create_at: {
      type: Date,
      default: Date.now
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true 
    },
    name: {
      type: String,
      required: true // Asegurar que siempre tenga nombre
    },
    imageUrl: {
      type: String, // Campo para almacenar la URL de la imagen
    }
  });
  

// Método estático para verificar si el email o el nick ya existen
UserSchema.statics.checkDuplicateUser = async function (email) {
    return await this.find({
        email: email.toLowerCase()
    }).exec();
};

// Método para cifrar la contraseña
UserSchema.methods.encryptPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

// Método para registrar el usuario
UserSchema.methods.registerUser = async function () {
    return await this.save();
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Método para generar el token JWT
UserSchema.methods.generateJWT = function () {
    const payload = {
        id: this._id,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix() // El token expira en 7 días
    };
    return jwt.encode(payload, secret); // Clave secreta almacenada en variables de entorno
};

export default model('User', UserSchema, "users");