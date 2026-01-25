import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

interface GalleryImage {
  _id: string;
  imageUrl: string;
  title: string;
  category: string;
  description?: string;
  createdAt: string;
}

const CATEGORY_OPTIONS = [
  "All",
  "Football",
  "Volleyball",
  "Basketball",
  "Kabaddi",
  "Badminton",
  "Chess",
  "Kho Kho",
  "Table Tennis",
  "Tug of War",
  "Sack Race",
  "Events",
  "Celebrations",
  "Other",
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GALLERY_LIST);
      setGalleryImages(response.data.gallery || []);
    } catch (error) {
      console.error("Failed to fetch gallery");
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-10 sm:py-16 pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-4">
            📸 Photo Gallery
          </h1>
          <p className="text-base sm:text-xl text-blue-200">
            Relive the best moments from our sports events
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b sticky top-14 sm:top-16 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap transition ${
                  selectedCategory === category
                    ? "bg-blue-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {loading ? (
          <div className="text-center py-12 sm:py-16 text-gray-500">
            <p className="text-base sm:text-xl">Loading photos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredImages.map((image) => (
              <div
                key={image._id}
                onClick={() => setSelectedImage(image)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://placehold.co/600x400/1e3a8a/ffffff?text=${encodeURIComponent(image.category)}`;
                    }}
                  />
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-900 text-white text-xs font-semibold rounded-full">
                      {image.category}
                    </span>
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{image.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">{formatDate(image.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-12 sm:py-16 text-gray-500">
            <p className="text-4xl sm:text-6xl mb-3 sm:mb-4">📷</p>
            <p className="text-base sm:text-xl">No photos found in this category</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-8 sm:-top-10 right-0 text-white text-2xl sm:text-3xl hover:text-gray-300"
              >
                ×
              </button>
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full rounded-lg max-h-[70vh] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://placehold.co/800x600/1e3a8a/ffffff?text=${encodeURIComponent(selectedImage.category)}`;
                }}
              />
              <div className="mt-3 sm:mt-4 text-white">
                <h2 className="text-xl sm:text-2xl font-bold">{selectedImage.title}</h2>
                <p className="text-gray-300 text-sm sm:text-base">
                  {selectedImage.category} • {formatDate(selectedImage.createdAt)}
                </p>
                {selectedImage.description && (
                  <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">{selectedImage.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
