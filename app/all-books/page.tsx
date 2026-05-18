'use client';

import { Suspense, useEffect, useState } from 'react';
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

const categories = ['All', 'Story', 'Tech', 'Science']; // ✅ component এর বাইরে নিলাম

function AllBooksContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

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
  }, []); // ✅ categories dependency সরিয়ে দিলাম

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = books;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

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
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold gradient-text">All Books</h1>
          <p className="text-lg text-gray-600">
            Explore our vast collection of {books.length} books
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title..."
              className="w-full py-4 pl-12 pr-4 text-lg transition-all border border-gray-300 shadow-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="lg:w-64">
            <div className="sticky p-6 bg-white shadow-md rounded-xl top-24">
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

          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="spinner"></div>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="py-20 text-center">
                <Book className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                <h3 className="mb-2 text-2xl font-bold text-gray-700">
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

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredBooks.map((book) => (
                    <div
                      key={book.id}
                      className="transition-transform duration-300 card-custom group hover:scale-105"
                    >
                      <div className="relative overflow-hidden h-72">
                        <Image
                          src={book.image_url}
                          alt={book.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute px-3 py-1 text-sm font-semibold text-white rounded-full shadow-lg top-3 right-3 bg-primary">
                          {book.category}
                        </div>
                        <div className="absolute px-3 py-1 text-sm font-semibold rounded-full bottom-3 left-3 bg-white/90 backdrop-blur-sm">
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
                        <h3 className="mb-2 text-xl font-bold line-clamp-1">
                          {book.title}
                        </h3>
                        <p className="mb-1 text-gray-600">by {book.author}</p>
                        <p className="mb-4 text-sm text-gray-500 line-clamp-2">
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

// ✅ Suspense দিয়ে wrap করলাম
export default function AllBooksPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    }>
      <AllBooksContent />
    </Suspense>
  );
}