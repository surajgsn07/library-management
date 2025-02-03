import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    issueDate: { type: Date, default: Date.now },
    expectedReturnDate: { type: Date },
    returnDate: { type: Date },
    type: { type: String, enum: ['Request','Borrow', 'Return'], required: true },
    createdAt: { type: Date, default: Date.now },
  });
  
  export const Issue = mongoose.model('Issue', IssueSchema);
  