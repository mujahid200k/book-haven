'use client';
 
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Book } from 'lucide-react';
 
interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  available_quantity: number;
  image_url: string;
}
 
export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
 
  const categories = ['All', 'Story', 'Tech', 'Science'];
 
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        const data = await response.json();
        setBooks(data.books || []);
        setFilteredBooks(data.books || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchBooks();
  }, []);
 
  // Handle URL category parameter
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
  }, [searchParams]);
 
  // Filter books based on search and category
  useEffect(() => {
    let filtered = books;
 
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }
 
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
 
    setFilteredBooks(filtered);
  }, [searchQuery, selectedCategory, books]);
 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 gradient-text">All Books</h1>
          <p className="text-gray-600 text-lg">
            Explore our vast collection of {books.length} books
          </p>
        </div>
 
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
            />
          </div>
        </div>
 
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Category Filter */}
          <aside className="lg:w-64">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Categories</h2>
              </div>
 
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-primary to-secondary text-white font-semibold'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                    {category !== 'All' && (
                      <span className="float-right text-sm">
                        ({books.filter((b) => b.category === category).length})
                      </span>
                    )}
                    {category === 'All' && (
                      <span className="float-right text-sm">({books.length})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>
 
          {/* Main Content - Books Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="spinner"></div>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-20">
                <Book className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  No books found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  Showing {filteredBooks.length} book(s)
                </div>
 
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className="card-custom group hover:scale-105 transition-transform duration-300"
                    >
                      <div className="relative h-72 overflow-hidden">
                        <Image
                          src={book.image_url}
                          alt={book.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          {book.category}
                        </div>
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                          {book.available_quantity > 0 ? (
                            <span className="text-green-600">
                              {book.available_quantity} available
                            </span>
                          ) : (
                            <span className="text-red-600">Out of stock</span>
                          )}
                        </div>
                      </div>
 
                      <div className="p-5">
                        <h3 className="font-bold text-xl mb-2 line-clamp-1">
                          {book.title}
                        </h3>
                        <p className="text-gray-600 mb-1">by {book.author}</p>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                          {book.description}
                        </p>
 
                        <Link
                          href={`/books/${book.id}`}
                          className="block w-full text-center bg-primary text-white py-2.5 rounded-lg hover:bg-secondary transition-colors font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}