import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';
import booksData from '@/data/books.json';
 
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
 
    // Check if books exist in database
    let books = await Book.find({});
 
    // If no books in database, seed from JSON
    if (books.length === 0) {
      await Book.insertMany(booksData);
      books = await Book.find({});
    }
 
    return NextResponse.json({
      success: true,
      books,
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch books',
      },
      { status: 500 }
    );
  }
}
