"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import Navbar from "@/components/layout/NavBar";

// Définition du type Admin
interface Admin {
  id: string;
  lname: string;
  fname: string;
}

const AdminDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { admins, loading, error, fetchAdminById } = useAdmin();
  const [admin, setAdmin] = useState<Admin | null>(null); // Utilisation du type défini
  const router = useRouter();
  
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!authLoading && user) {
        try {
          const adminData = await fetchAdminById(user.id);
          setAdmin(adminData || null);
        } catch (err) {
          console.error("Erreur lors de la récupération de l'étudiant :", err);
        }
      }
    };
  
    fetchAdminData(); // Appeler la fonction directement ici
  }, [authLoading, user]); // Limiter les dépendances

  if (authLoading || loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div>
      <Navbar role="ADMIN" />

    </div>
  );
};

export default AdminDashboard;
