import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BorrowedBook from '@/models/BorrowedBook';
import Book from '@/models/Book';

export const dynamic = 'force-dynamic'; // ✅ এই line টা যোগ করো

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User ID is required',
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const borrowedBooks = await BorrowedBook.find({ userId }).sort({
      borrowDate: -1,
    });

    const borrowedBooksWithDetails = await Promise.all(
      borrowedBooks.map(async (borrowedBook) => {
        const book = await Book.findOne({ id: borrowedBook.bookId });
        return {
          ...borrowedBook.toObject(),
          book: book ? book.toObject() : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      borrowedBooks: borrowedBooksWithDetails,
    });
  } catch (error) {
    console.error('Error fetching borrowed books:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch borrowed books',
      },
      { status: 500 }
    );
  }
}



