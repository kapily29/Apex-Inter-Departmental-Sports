import { createContext, useContext, useState, type ReactNode } from "react";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type?: "success" | "error" | "info" | "warning") => void;
  removeNotification: (id: string) => void;
  showConfirm: (message: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
    resolve: ((value: boolean) => void) | null;
  }>({ isOpen: false, message: "", resolve: null });

  const showNotification = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmModal({ isOpen: true, message, resolve });
    });
  };

  const handleConfirm = (result: boolean) => {
    if (confirmModal.resolve) {
      confirmModal.resolve(result);
    }
    setConfirmModal({ isOpen: false, message: "", resolve: null });
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification, showConfirm }}>
      {children}
      
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 max-w-sm sm:max-w-md ml-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-lg ${getNotificationStyles(notification.type)} animate-slide-in text-sm sm:text-base`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex-1">{notification.message}</span>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white hover:opacity-80 p-1"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-md w-full">
            <p className="text-gray-800 mb-4 sm:mb-6 text-sm sm:text-base">{confirmModal.message}</p>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => handleConfirm(false)}
                className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirm(true)}
                className="px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm sm:text-base"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
