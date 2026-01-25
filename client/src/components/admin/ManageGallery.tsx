import { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useNotification } from "../../context/NotificationContext";
import { API_ENDPOINTS } from "../../config/api";
import axios from "axios";

interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  category: string;
  description: string;
  createdAt: string;
}

const CATEGORY_OPTIONS = [
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

interface ManageGalleryProps {
  refreshKey?: number;
}

export default function ManageGallery({ refreshKey }: ManageGalleryProps) {
  const { token } = useAdmin();
  const { showNotification, showConfirm } = useNotification();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Add modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    title: "",
    imageUrl: "",
    category: "",
    description: "",
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    fetchGallery();
  }, [token, refreshKey]);

  const fetchGallery = async () => {
    if (!token) return;
    try {
      const response = await axios.get(API_ENDPOINTS.GALLERY_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGallery(response.data.gallery || []);
    } catch (error) {
      console.error("Failed to fetch gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm("Are you sure you want to delete this photo?");
    if (confirmed) {
      try {
        await axios.delete(API_ENDPOINTS.GALLERY_DELETE(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGallery(gallery.filter((item) => item._id !== id));
        showNotification("Photo deleted successfully", "success");
      } catch (error) {
        showNotification("Failed to delete photo", "error");
      }
    }
  };

  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");

    try {
      const response = await axios.post(API_ENDPOINTS.GALLERY_CREATE, addFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setGallery([response.data.item, ...gallery]);
      setAddFormData({ title: "", imageUrl: "", category: "", description: "" });
      setIsAddModalOpen(false);
      showNotification("Photo added successfully", "success");
    } catch (err: any) {
      setAddError(err.response?.data?.error || "Failed to add photo");
    } finally {
      setAddLoading(false);
    }
  };

  const categories = ["All", ...new Set(gallery.map((item) => item.category).filter(Boolean))];
  
  const filteredGallery = gallery.filter((item) => {
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
    const searchMatch = searchQuery === "" || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Manage Gallery</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
        >
          + Add Photo
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="border-b px-3 sm:px-6 py-3 sm:py-4 bg-slate-50 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:min-w-[200px] sm:w-auto"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none w-full sm:w-auto"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Gallery Grid */}
      <div className="p-3 sm:p-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {filteredGallery.map((item) => (
          <div
            key={item._id}
            className="bg-slate-50 rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition"
          >
            <div className="h-28 sm:h-40 bg-gray-200 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
            </div>
            <div className="p-2 sm:p-4">
              <h3 className="font-semibold text-slate-900 truncate text-sm sm:text-base">{item.title}</h3>
              <p className="text-xs sm:text-sm text-blue-600 font-medium">{item.category}</p>
              {item.description && (
                <p className="text-xs sm:text-sm text-slate-500 mt-1 truncate hidden sm:block">{item.description}</p>
              )}
              <button
                onClick={() => handleDelete(item._id)}
                className="mt-2 sm:mt-3 w-full text-xs sm:text-sm text-red-600 hover:text-red-700 font-semibold px-2 py-1 bg-red-50 rounded"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredGallery.length === 0 && !loading && (
        <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-gray-500 text-sm">
          No photos found. Add your first photo!
        </div>
      )}

      {/* Add Photo Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Add Photo</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {addError && (
                <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
                  {addError}
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={addFormData.title}
                    onChange={handleAddChange}
                    placeholder="Photo title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={addFormData.imageUrl}
                    onChange={handleAddChange}
                    placeholder="https://example.com/image.jpg"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={addFormData.category}
                    onChange={handleAddChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={addFormData.description}
                    onChange={handleAddChange}
                    placeholder="Photo description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                  >
                    {addLoading ? "Adding..." : "Add Photo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
