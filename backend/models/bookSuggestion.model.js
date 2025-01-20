import mongoose  from "mongoose";

const BookSuggestionSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    genre: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    picture:{type: String, default:""},
  });
  
  export const BookSuggestion = mongoose.model('BookSuggestion', BookSuggestionSchema);