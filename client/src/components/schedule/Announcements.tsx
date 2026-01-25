import { useEffect, useState, useRef } from "react";
import { API_ENDPOINTS } from "../../config/api";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  priority: string;
  createdAt: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS_LIST);
        const data = await response.json();
        setAnnouncements(data.announcements || data || []);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (announcements.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [announcements.length]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return { bg: "border-l-red-500 bg-red-50", badge: "bg-red-500 text-white", icon: "!" };
      case "high":
        return { bg: "border-l-orange-500 bg-orange-50", badge: "bg-orange-500 text-white", icon: "!" };
      case "medium":
        return { bg: "border-l-yellow-500 bg-yellow-50", badge: "bg-yellow-500 text-white", icon: "" };
      case "low":
        return { bg: "border-l-green-500 bg-green-50", badge: "bg-green-500 text-white", icon: "" };
      default:
        return { bg: "border-l-blue-500 bg-blue-50", badge: "bg-blue-500 text-white", icon: "" };
    }
  };

  return (
    <aside className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
      <div className="border-b px-4 sm:px-6 py-3 sm:py-4 bg-blue-600">
        <h2 className="text-base sm:text-lg font-extrabold text-white">
          Important Announcements
        </h2>
      </div>

      <div className="p-3 sm:p-4">
        {loading ? (
          <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-slate-500 text-sm">Loading...</div>
        ) : announcements.length === 0 ? (
          <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-slate-500 text-sm">No announcements</div>
        ) : (
          <div className="relative min-h-[100px] sm:min-h-[120px]">
            {/* Current Announcement */}
            {announcements.map((announcement, index) => {
              const styles = getPriorityStyles(announcement.priority);
              return (
                <div
                  key={announcement._id}
                  className={`transition-all duration-500 ${index === currentIndex ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}`}
                >
                  <div className={`px-3 sm:px-4 py-2 sm:py-3 border-l-4 rounded-r-lg ${styles.bg}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                        {styles.icon && <span className="text-red-600 mr-1">{styles.icon}</span>}
                        {announcement.title}
                      </div>
                      <span className={`px-1.5 sm:px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${styles.badge}`}>
                        {announcement.priority?.charAt(0).toUpperCase() + announcement.priority?.slice(1)}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {formatDate(announcement.createdAt)}
                    </div>
                    <div className="text-xs text-slate-600 mt-1 line-clamp-2 sm:line-clamp-none">
                      {announcement.description}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Navigation Dots */}
            {announcements.length > 1 && (
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                {announcements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? "bg-blue-600 w-4" : "bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
