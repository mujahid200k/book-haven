'use client';
 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { User, Mail, Calendar, BookOpen, Edit, Package } from 'lucide-react';
 
interface BorrowedBook {
  _id: string;
  bookId: string;
  borrowDate: string;
  status: string;
  book: {
    id: string;
    title: string;
    author: string;
    image_url: string;
    category: string;
  };
}
 
export default function MyProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    // Redirect if not logged in
    if (!isPending && !session?.user) {
      toast.error('Please login to view your profile');
      router.push('/login');
      return;
    }
 
    const fetchBorrowedBooks = async () => {
      if (!session?.user) return;
 
      try {
        const response = await fetch(`/api/borrowed-books?userId=${session.user.id}`);
        const data = await response.json();
 
        if (data.success) {
          setBorrowedBooks(data.borrowedBooks || []);
        }
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      } finally {
        setLoading(false);
      }
    };
 
    if (session?.user) {
      fetchBorrowedBooks();
    }
  }, [session, isPending, router]);
 
  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }
 
  if (!session?.user) {
    return null;
  }
 
  const activeBorrows = borrowedBooks.filter((b) => b.status === 'borrowed');
 
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary to-secondary h-32"></div>
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>
 
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {session.user.name}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Mail className="w-4 h-4" />
                    <span>{session.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Member since{' '}
                      {new Date(session.user.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
 
                <Link
                  href="/update-profile"
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-medium"
                >
                  <Edit className="w-5 h-5" />
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
 
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Currently Borrowed</p>
                  <p className="text-2xl font-bold text-gray-800">{activeBorrows.length}</p>
                </div>
              </div>
            </div>
 
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Borrowed</p>
                  <p className="text-2xl font-bold text-gray-800">{borrowedBooks.length}</p>
                </div>
              </div>
            </div>
 
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <User className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Member Status</p>
                  <p className="text-2xl font-bold text-gray-800">Active</p>
                </div>
              </div>
            </div>
          </div>
 
          {/* Borrowed Books Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6">My Borrowed Books</h2>
 
            {borrowedBooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No borrowed books yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start exploring our collection and borrow your first book!
                </p>
                <Link
                  href="/all-books"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-medium"
                >
                  Browse Books
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {borrowedBooks.map((borrowedBook) => (
                  <div
                    key={borrowedBook._id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48">
                      <Image
                        src={borrowedBook.book.image_url}
                        alt={borrowedBook.book.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            borrowedBook.status === 'borrowed'
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-500 text-white'
                          }`}
                        >
                          {borrowedBook.status === 'borrowed' ? 'Active' : 'Returned'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1 line-clamp-1">
                        {borrowedBook.book.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        by {borrowedBook.book.author}
                      </p>
                      <p className="text-xs text-gray-500">
                        Borrowed on{' '}
                        {new Date(borrowedBook.borrowDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 