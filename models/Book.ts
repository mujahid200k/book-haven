import mongoose, { Schema, Document } from 'mongoose';
 
export interface IBook extends Document {
  id: string;
  title: string;
  author: string;
  description: string;
  category: 'Story' | 'Tech' | 'Science';
  available_quantity: number;
  image_url: string;
  createdAt: Date;
  updatedAt: Date;
}
 
const BookSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Story', 'Tech', 'Science'],
    },
    available_quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    image_url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
 
export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
 