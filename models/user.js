import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jwt-simple';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

const ROLES = ['admin', 'gerente', 'cliente']

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  phone: {
    type: String
  },
  address: {
    type: String,
  },
  role: {
    type: String,
    enum: ROLES,
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
    required: true
  },
  imageUrl: {
    type: String,
  },
  visitedCabins: [
    {
      cabinId: {
        type: Schema.Types.ObjectId,
        ref: "Cabania"
      },
      visitedAt: {
        type: Date,
        default: Date.now
      },
    },
  ],
});


UserSchema.statics.checkDuplicateUser = async function (email) {
  return await this.find({
    email: email.toLowerCase()
  }).exec();
};

UserSchema.methods.encryptPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

UserSchema.methods.registerUser = async function () {
  return await this.save();
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateJWT = function () {
  const payload = {
    id: this._id,
    iat: moment().unix(),
    exp: moment().add(7, 'days').unix()
  };
  return jwt.encode(payload, secret);
};

export default model('User', UserSchema, "users");