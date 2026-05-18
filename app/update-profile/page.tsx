'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { User, Image as ImageIcon, Save } from 'lucide-react';
 
export default function UpdateProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error('Please login to update your profile');
      router.push('/login');
      return;
    }
 
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        image: session.user.image || '',
      });
    }
  }, [session, isPending, router]);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
 
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
 
    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          image: formData.image,
        }),
      });
 
      const data = await response.json();
 
      if (data.success) {
        toast.success('Profile updated successfully!');
        router.push('/my-profile');
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
 
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }
 
  if (!session?.user) {
    return null;
  }
 
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="overflow-hidden bg-white shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="p-8 text-center text-white bg-gradient-to-r from-primary to-secondary">
            <h1 className="mb-2 text-3xl font-bold">Update Profile</h1>
            <p className="text-gray-100">Customize your profile information</p>
          </div>
 
          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full py-3 pl-10 pr-4 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>
 
              {/* Image URL Input */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Profile Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full py-3 pl-10 pr-4 transition-all border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                {/* Image Preview */}
                {formData.image && (
                  <div className="mt-3">
                    <p className="mb-2 text-sm text-gray-600">Preview:</p>
                    <div className="w-24 h-24 overflow-hidden border-2 border-gray-200 rounded-full">
                      <img                                    // ✅ fixed
                        src={formData.image}
                        alt="Preview"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
 
              {/* Update Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Information
                  </>
                )}
              </button>
            </form>
 
            {/* Back Link */}
            <div className="mt-6 text-center">
              <button
                onClick={() => router.back()}
                className="font-semibold text-primary hover:underline"
              >
                &larr; Back to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}