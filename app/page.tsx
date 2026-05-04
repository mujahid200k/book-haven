'use client';
 
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, TrendingUp, Users, Award, ArrowRight, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
 
interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  available_quantity: number;
  image_url: string;
}
 
export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchFeaturedBooks = async () => {
      try {
        const response = await fetch('/api/books/featured');
        const data = await response.json();
        setFeaturedBooks(data.books || []);
      } catch (error) {
        console.error('Error fetching featured books:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchFeaturedBooks();
  }, []);
 
  const stats = [
    { icon: BookOpen, label: 'Books Available', value: '10,000+' },
    { icon: Users, label: 'Active Readers', value: '5,000+' },
    { icon: TrendingUp, label: 'Books Borrowed', value: '50,000+' },
    { icon: Award, label: 'Categories', value: '50+' },
  ];
 
  const categories = [
    { name: 'Fiction', color: 'from-blue-500 to-cyan-500', icon: '📚' },
    { name: 'Technology', color: 'from-purple-500 to-pink-500', icon: '💻' },
    { name: 'Science', color: 'from-green-500 to-teal-500', icon: '🔬' },
    { name: 'Self-Help', color: 'from-orange-500 to-red-500', icon: '🌟' },
  ];
 
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary via-secondary to-accent text-white py-20 md:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Find Your Next Read
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fade-in animation-delay-200">
              Explore thousands of books across all genres. Your next adventure awaits!
            </p>
            <Link
              href="/all-books"
              className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in animation-delay-400"
            >
              Browse Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
 
      {/* Marquee Section */}
      <div className="bg-gray-900 text-white py-4 overflow-hidden">
        <div className="flex whitespace-nowrap">
          <div className="marquee flex items-center gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  New Arrivals: The Midnight Library
                </span>
                <span className="text-gray-400">|</span>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Special: 20% Off on Tech Books
                </span>
                <span className="text-gray-400">|</span>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Featured: Sapiens by Yuval Noah Harari
                </span>
                <span className="text-gray-400">|</span>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Join 5000+ Happy Readers Today!
                </span>
                <span className="text-gray-400">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* Featured Books Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Books</h2>
            <p className="text-gray-600 text-lg">Handpicked selections just for you</p>
          </div>
 
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBooks.map((book) => (
                <div
                  key={book.id}
                  className="card-custom group hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={book.image_url}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {book.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">by {book.author}</p>
                    <Link
                      href={`/books/${book.id}`}
                      className="block w-full text-center bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
 
      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Popular Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Categories</h2>
            <p className="text-gray-600 text-lg">Explore books by your favorite genre</p>
          </div>
 
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/all-books?category=${category.name}`}
                className={`bg-gradient-to-br ${category.color} p-8 rounded-xl text-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center`}
              >
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-bold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
 
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Readers Say</h2>
            <p className="text-gray-600 text-lg">Join thousands of satisfied book lovers</p>
          </div>
 
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {[
              {
                name: 'Sarah Ahmed',
                role: 'Book Enthusiast',
                text: 'Book Haven has completely transformed my reading habits. The selection is amazing!',
              },
              {
                name: 'Rafiq Hassan',
                role: 'Student',
                text: 'As a student, this platform has been invaluable for accessing textbooks and references.',
              },
              {
                name: 'Nadia Khan',
                role: 'Professional',
                text: 'Love the digital borrowing system. So convenient and user-friendly!',
              },
              {
                name: 'Karim Rahman',
                role: 'Teacher',
                text: 'I recommend Book Haven to all my students. Great collection and easy to use.',
              },
            ].map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-gray-50 p-6 rounded-xl h-full">
                  <div className="text-yellow-400 text-2xl mb-3">★★★★★</div>
                  <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.text}&rdquo;</p>
                  <div>
                    <p className="font-bold text-gray-800">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}