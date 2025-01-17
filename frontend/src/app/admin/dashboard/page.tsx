"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import Navbar from "@/components/layout/NavBar";
import QuestionnaireCard from "@/components/admin/QuestionnaireCard";
import Loader from "@/components/common/Loader";
import { useForms } from "@/hooks/useForms";

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
  const { forms, loadingForm, errorForm } = useForms(); // a remplir dans useForm pour gérer les questionnaires

  
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
    return <Loader/>;
  }

  if (!user) {
    router.push("/");
    return null;
  }

  if (errorForm) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        <h1 className="text-3xl font-bold mb-6">Erreur</h1>
        <p>{error}</p>
      </div>
    );
  }

  if(loadingForm){
    return <Loader/>
  }

  return (
    <div className="container mx-auto p-6">
      <Navbar role="ADMIN"/>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord - Administrateur</h1>
      
      {/* Affichage des questionnaires sous forme de cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {forms.map((form) => (
          <QuestionnaireCard
            key={form.id}
            title={form.title}
            subject={form.subject}
            teacherName={form.teacherName}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
