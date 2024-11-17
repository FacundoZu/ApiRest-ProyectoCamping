import { Schema, model } from 'mongoose';

const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cabin: {
    type: Schema.Types.ObjectId,
    ref: 'Cabania',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comments: [
    {
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    required: true,
    enum: ['Habilitado', 'Deshabilitado'],
    default: 'Habilitado'
  }
});


export default model('Review', ReviewSchema, 'reviews');
