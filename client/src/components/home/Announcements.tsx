import { useEffect, useState, useRef } from "react";
import Card from "../../components/ui/Card";
import CardHeader from "../../components/ui/CardHeader";
import CardSection from "../../components/ui/CardSection";
import { API_ENDPOINTS } from "../../config/api";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  priority: string;
  createdAt: string;
}

export default function Announcements() {
  const [news, setNews] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.ANNOUNCEMENTS_LIST);
        const data = await response.json();
        setNews(data.announcements || data || []);
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
    if (news.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % news.length);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [news.length]);

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
        return { bg: "border-red-500 bg-red-50", badge: "bg-red-500 text-white", icon: "!" };
      case "high":
        return { bg: "border-orange-500 bg-orange-50", badge: "bg-orange-500 text-white", icon: "!" };
      case "medium":
        return { bg: "border-yellow-500 bg-yellow-50", badge: "bg-yellow-500 text-white", icon: "" };
      case "low":
        return { bg: "border-green-500 bg-green-50", badge: "bg-green-500 text-white", icon: "" };
      default:
        return { bg: "border-blue-500 bg-blue-50", badge: "bg-blue-500 text-white", icon: "" };
    }
  };

  return (
    <aside>
      <Card>
        <CardHeader title="Announcements & News" />

        <CardSection>
          {loading ? (
            <div className="text-center py-4 text-slate-500">Loading...</div>
          ) : news.length === 0 ? (
            <div className="text-center py-4 text-slate-500">No announcements yet</div>
          ) : (
            <div className="relative">
              {/* Current Announcement */}
              {news.map((n, index) => {
                const styles = getPriorityStyles(n.priority);
                return (
                  <div
                    key={n._id}
                    className={`transition-all duration-500 ${index === currentIndex ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}`}
                  >
                    <div className={`rounded-lg border-l-4 p-3 sm:p-4 ${styles.bg}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-bold text-slate-900 text-sm sm:text-base">
                          {styles.icon && <span className="text-red-600 mr-1">{styles.icon}</span>}
                          {n.title}
                        </div>
                        <span className={`px-1.5 sm:px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${styles.badge}`}>
                          {n.priority?.charAt(0).toUpperCase() + n.priority?.slice(1)}
                        </span>
                      </div>
                      <div className="mt-1 text-xs font-semibold text-slate-500">
                        {formatDate(n.createdAt)}
                      </div>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3">{n.description}</p>
                    </div>
                  </div>
                );
              })}

              {/* Navigation Dots */}
              {news.length > 1 && (
                <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                  {news.map((_, index) => (
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
        </CardSection>
      </Card>
    </aside>
  );
}
