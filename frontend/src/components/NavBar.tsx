"use client";

import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom"; // Ajout pour navigation dynamique
import { FaBell } from "react-icons/fa"; // Icône pour la cloche de notification
import { HiChevronDown } from "react-icons/hi"; // Icône pour le menu déroulant
import Notifications from "./Notifications";

interface NavbarProps {
  role: "ADMIN" | "TEACHER" | "STUDENT"; // Définition des rôles possibles
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation(); // Récupère l'URL actuelle

  // Liens spécifiques en fonction du rôle
  const getNavLinks = (role: "ADMIN" | "TEACHER" | "STUDENT") => {
    // Définir la base de l'URL en fonction du rôle
    const baseUrl = (() => {
      switch (role) {
        case "ADMIN":
          return "/admin";
        case "TEACHER":
          return "/teacher";
        case "STUDENT":
          return "/student";
        default:
          return "/";
      }
    })();
  
    // Définir les chemins relatifs
    const links = {
      ADMIN: [
        { label: "Tableau de bord", href: "/dashboard" },
        { label: "Gestion des utilisateurs", href: "/users" },
        { label: "Formulaires", href: "/forms" },
        { label: "Analytics", href: "/analytics" },
        { label: "Configuration", href: "/settings" },
      ],
      TEACHER: [
        { label: "Tableau de bord", href: "/dashboard" },
        { label: "Évaluations", href: "/evaluations" },
        { label: "Mes statistiques", href: "/stats" },
      ],
      STUDENT: [
        { label: "Tableau de bord", href: "/dashboard" },
        { label: "Historique", href: "/history" },
      ],
    };
  
    // Retourner les liens avec la base de l'URL ajoutée
    return (links[role] || []).map((link) => ({
      ...link,
      href: `${baseUrl}${link.href}`, // Combiner la base URL avec le chemin
    }));
  };

  return (
    <header className="bg-[#2F1893] text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <span className="font-bold text-xl">EFREI</span>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex space-x-6">
          {getNavLinks(role).map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) =>
                `${
                  location.pathname === link.href
                    ? "bg-white text-[#2F1893] py-1 rounded-xl px-4" // Active style
                    : "text-gray-200 rounded-xl py-1 px-4 hover:bg-[#1E0E62]"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Notifications and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <Notifications />

          {/* User Dropdown */}
          <div className="relative">
            <button
              className="flex items-center justify-between bg-[#1E0E62] rounded-3xl w-44 h-12 px-4"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <span>{role === "ADMIN"
                  ? "Administrateur"
                  : role === "TEACHER"
                  ? "Professeur"
                  : "Élève"}
              </span>
              <HiChevronDown className="w-4 h-4"/>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-md w-48">
                <a
                  href="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profil
                </a>
                <a
                  href="/"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Déconnexion
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
