"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import QuestionnaireCard from "@/components/admin/QuestionnaireCard";
import Loader from "@/components/common/Loader";

// Définition du type Admin
interface Admin {
  id: string;
  lname: string;
  fname: string;
}

// Définir un type pour les formulaires
interface Form {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
}

const AdminDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { admins, loading, error, fetchAdminById } = useAdmin();
  const [admin, setAdmin] = useState<Admin | null>(null); // Utilisation du type défini
  const router = useRouter();

  // Remplacer l'appel au hook useForms par des données en dur pour les formulaires
  const [forms, setForms] = useState<Form[]>([
    {
      id: "1",
      title: "Formulaire de Feedback",
      subject: "Mathématiques",
      teacherName: "Prof. Dupont",
    },
    {
      id: "2",
      title: "Formulaire d'Évaluation",
      subject: "Physique",
      teacherName: "Prof. Martin",
    },
    {
      id: "3",
      title: "Questionnaire de Satisfation",
      subject: "Informatique",
      teacherName: "Prof. Leclerc",
    },
  ]);
  const [loadingForm, setLoadingForm] = useState<boolean>(false); // Simuler l'état de chargement

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!authLoading && user) {
        try {
          const adminData = await fetchAdminById(user.id);
          setAdmin(adminData || null);
        } catch (err) {
          console.error("Erreur lors de la récupération de l'administrateur :", err);
        }
      }
    };
  
    fetchAdminData(); // Appeler la fonction directement ici
  }, [authLoading, user]); // Limiter les dépendances

  if (authLoading || loading) {
    return <Loader />;
  }

  if (!user) {
    router.push("/");
    return null;
  }

  if (loadingForm) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-6">
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
