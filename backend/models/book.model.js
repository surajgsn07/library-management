import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    picture:{type: String, default:""},
    genre: { type: String, required: true },
    quantities: { type: Number, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    ISBN: { type: String, unique: true, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  export const Book = mongoose.model('Book', BookSchema);
  