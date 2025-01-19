"use client"

import { useState } from "react";
import { usePathname, useRouter } from 'next/navigation'; // Importer usePathname
import Link from "next/link";
import { HiChevronDown } from "react-icons/hi";
import Notifications from "../common/Notifications";
import { useAuth } from "@/hooks/useAuth";  // Importer le hook useAuth

interface NavbarProps {
  role: "ADMIN" | "TEACHER" | "STUDENT";
}

const Navbar: React.FC<NavbarProps> = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname(); // Récupérer le chemin actuel
  const { logout, role } = useAuth();  // Utiliser le hook useAuth à l'intérieur du composant
  const router = useRouter();  // Initialiser le routeur

  const getNavLinks = (role: "ADMIN" | "TEACHER" | "STUDENT") => {
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

    const links = {
      ADMIN: [
        { label: "Tableau de bord", href: "/dashboard" },
        { label: "Gestion des utilisateurs", href: "/users" },
        { label: "Formulaires", href: "/forms" },
      ],
      TEACHER: [
        { label: "Tableau de bord", href: "/dashboard" },
        { label: "Évaluations", href: "/evaluations" },
      ],
      STUDENT: [
        { label: "Tableau de bord", href: "/dashboard" },
        { label: "Historique", href: "/history" },
      ],
    };

    return (links[role] || []).map((link) => ({
      ...link,
      href: `${baseUrl}${link.href}`,
    }));
  };

  const handleSignOut = async () => {
    await logout();  
    router.push('/');
  };

  return (
    <header className="bg-[#4f46e5] text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-xl">EFREI</span>
        </div>

        <nav className="hidden md:flex space-x-6">
          {getNavLinks(role).map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`${pathname === link.href
                ? "bg-white text-[#2F1893] py-1 rounded-xl px-4"
                : "text-gray-200 rounded-xl py-1 px-4 hover:bg-[#1E0E62]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <Notifications />

          <div className="relative">
            <button
              className="flex items-center justify-between bg-[#3b35ad] rounded-3xl w-44 h-12 px-4"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen ? "true" : "false"}
            >
              <span>{role === "ADMIN"
                  ? "Administrateur"
                  : role === "TEACHER"
                  ? "Professeur"
                  : "Élève"}
              </span>
              <HiChevronDown
                className={`w-4 h-4 transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-gray-800 rounded shadow-md w-48">
                <button
                  onClick={handleSignOut}  // Appel de la fonction handleSignOut
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
