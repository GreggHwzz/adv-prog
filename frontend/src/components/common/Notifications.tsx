"use client"

import { useState } from "react";
import { FaBell } from "react-icons/fa";
import { HiX } from "react-icons/hi";

const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Exemple de notifications 
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nouvelle évaluation disponible", read: false },
    { id: 2, message: "Votre profil a été mis à jour", read: false }
  ]); 

  const unreadNotifications = notifications.filter(notification => !notification.read);
  const unreadNotificationsCount = unreadNotifications.length;

  const iconColor = unreadNotificationsCount > 0 ? "text-white" : "text-[#1E0E62]";

  // La on larque la notif comme lue
  const handleMouseEnter = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDelete = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="relative">
      {/* Bouton Notification */}
      <button
        className="relative"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen ? "true" : "false"}
        aria-label="Notifications"
      >
        <FaBell className={`w-6 h-6 ${iconColor} hover:text-gray-300`} />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Dropdown Notifications */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white text-gray-600 rounded-lg shadow-lg"
          role="dialog"
          aria-live="polite"
          aria-labelledby="notification-menu"
        >
          <div>
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification, index) => (
                  <li
                    key={notification.id}
                    className={`p-3 bg-[#69697c] rounded hover:bg-[#d6d6d6] transition ${
                      notification.read ? "bg-opacity-0 text-[#3A3B5B]" : "text-white"
                    } ${index !== notifications.length - 1 ? "border-b-2 border-gray-400 border-rounded-none" : ""}`}
                    onMouseEnter={() => handleMouseEnter(notification.id)}
                    aria-live="assertive"
                    aria-atomic="true"
                    aria-label={notification.read ? `Notification lue: ${notification.message}` : `Notification non lue: ${notification.message}`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{notification.message}</span>
                      {/* Icône de suppression */}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="text-white hover:text-gray-300"
                        aria-label={`Supprimer la notification "${notification.message}"`}
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-gray-300 p-4">
                Il n&apos;y a plus de nouvelles notifications
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
