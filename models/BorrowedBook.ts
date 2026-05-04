import mongoose, { Schema, Document } from 'mongoose';
 
export interface IBorrowedBook extends Document {
  userId: string;
  bookId: string;
  borrowDate: Date;
  returnDate?: Date;
  status: 'borrowed' | 'returned';
  createdAt: Date;
  updatedAt: Date;
}
 
const BorrowedBookSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    bookId: {
      type: String,
      required: true,
    },
    borrowDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      required: true,
      enum: ['borrowed', 'returned'],
      default: 'borrowed',
    },
  },
  {
    timestamps: true,
  }
);
 
export default mongoose.models.BorrowedBook || 
  mongoose.model<IBorrowedBook>('BorrowedBook', BorrowedBookSchema);