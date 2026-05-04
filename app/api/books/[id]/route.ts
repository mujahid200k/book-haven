import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';
 
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
 
    const book = await Book.findOne({ id: params.id });
 
    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: 'Book not found',
        },
        { status: 404 }
      );
    }
 
    return NextResponse.json({
      success: true,
      book,
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch book',
      },
      { status: 500 }
    );
  }
}


