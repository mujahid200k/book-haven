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
 
    // Get top 4 books with highest availability
    const featuredBooks = books
      .sort((a, b) => b.available_quantity - a.available_quantity)
      .slice(0, 4);
 
    return NextResponse.json({
      success: true,
      books: featuredBooks,
    });
  } catch (error) {
    console.error('Error fetching featured books:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch featured books',
      },
      { status: 500 }
    );
  }
}

