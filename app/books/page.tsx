'use client';
 
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { BookOpen, User as UserIcon, Tag, Package } from 'lucide-react';
 
interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  available_quantity: number;
  image_url: string;
}
 
export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
 
  useEffect(() => {
    // Redirect if not logged in
    if (!isPending && !session?.user) {
      toast.error('Please login to view book details');
      router.push('/login');
      return;
    }
 
    const fetchBook = async () => {
      try {
        const response = await fetch(`/api/books/${id}`);
        const data = await response.json();
 
        if (data.success) {
          setBook(data.book);
        } else {
          toast.error('Book not found');
          router.push('/all-books');
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        toast.error('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };
 
    if (session?.user) {
      fetchBook();
    }
  }, [id, session, isPending, router]);
 
  const handleBorrow = async () => {
    if (!session?.user) {
      toast.error('Please login to borrow books');
      router.push('/login');
      return;
    }
 
    if (!book || book.available_quantity <= 0) {
      toast.error('This book is currently unavailable');
      return;
    }
 
    setBorrowing(true);
 
    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.id,
          userId: session.user.id,
        }),
      });
 
      const data = await response.json();
 
      if (data.success) {
        toast.success('Book borrowed successfully!');
        // Refresh book data
        const updatedResponse = await fetch(`/api/books/${id}`);
        const updatedData = await updatedResponse.json();
        if (updatedData.success) {
          setBook(updatedData.book);
        }
      } else {
        toast.error(data.message || 'Failed to borrow book');
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      toast.error('Failed to borrow book');
    } finally {
      setBorrowing(false);
    }
  };
 
  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
 
  if (!book) {
    return null;
  }
 
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
            {/* Left - Book Cover */}
            <div className="space-y-4">
              <div className="relative h-96 md:h-full min-h-[500px] rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={book.image_url}
                  alt={book.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
 
            {/* Right - Book Details */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                  <Tag className="w-4 h-4" />
                  <span className="font-semibold">{book.category}</span>
                </div>
 
                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {book.title}
                </h1>
 
                {/* Author */}
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <UserIcon className="w-5 h-5" />
                  <span className="text-lg">by {book.author}</span>
                </div>
 
                {/* Description */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">About this book</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {book.description}
                  </p>
                </div>
 
                {/* Availability */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg">Availability</h3>
                  </div>
                  {book.available_quantity > 0 ? (
                    <p className="text-green-600 font-semibold">
                      {book.available_quantity} {book.available_quantity === 1 ? 'copy' : 'copies'} available
                    </p>
                  ) : (
                    <p className="text-red-600 font-semibold">
                      Currently unavailable
                    </p>
                  )}
                </div>
              </div>
 
              {/* Borrow Button */}
              <button
                onClick={handleBorrow}
                disabled={borrowing || book.available_quantity <= 0}
                className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  book.available_quantity > 0
                    ? 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transform hover:-translate-y-0.5'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {borrowing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Borrowing...
                  </>
                ) : book.available_quantity > 0 ? (
                  <>
                    <BookOpen className="w-6 h-6" />
                    Borrow This Book
                  </>
                ) : (
                  'Out of Stock'
                )}
              </button>
 
              <p className="text-center text-sm text-gray-500 mt-4">
                Free borrowing • 14 days return period
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 