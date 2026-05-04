import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';
import BorrowedBook from '@/models/BorrowedBook';
 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookId, userId } = body;
 
    if (!bookId || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Book ID and User ID are required',
        },
        { status: 400 }
      );
    }
 
    await dbConnect();
 
    // Find the book
    const book = await Book.findOne({ id: bookId });
 
    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: 'Book not found',
        },
        { status: 404 }
      );
    }
 
    // Check if book is available
    if (book.available_quantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Book is currently unavailable',
        },
        { status: 400 }
      );
    }
 
    // Check if user already borrowed this book
    const existingBorrow = await BorrowedBook.findOne({
      userId,
      bookId,
      status: 'borrowed',
    });
 
    if (existingBorrow) {
      return NextResponse.json(
        {
          success: false,
          message: 'You have already borrowed this book',
        },
        { status: 400 }
      );
    }
 
    // Create borrowed book record
    const borrowedBook = await BorrowedBook.create({
      userId,
      bookId,
      borrowDate: new Date(),
      status: 'borrowed',
    });
 
    // Decrease available quantity
    book.available_quantity -= 1;
    await book.save();
 
    return NextResponse.json({
      success: true,
      message: 'Book borrowed successfully',
      borrowedBook,
    });
  } catch (error) {
    console.error('Error borrowing book:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to borrow book',
      },
      { status: 500 }
    );
  }
}

