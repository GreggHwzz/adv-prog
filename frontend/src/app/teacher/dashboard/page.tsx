"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTeacher } from "@/hooks/useTeacher";
import Navbar from "@/components/layout/NavBar";

// Définition du type Teacher
interface Teacher {
  id: string;
  lname: string;
  fname: string;
}

const TeacherDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { teachers, loading, error, fetchTeacherById } = useTeacher();
  const [teacher, setTeacher] = useState<Teacher | null>(null); // Utilisation du type défini
  const router = useRouter();

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!authLoading && user) {
        try {
          const teacherData = await fetchTeacherById(user.id);
          setTeacher(teacherData || null);
        } catch (err) {
          console.error("Erreur lors de la récupération de l'étudiant :", err);
        }
      }
    };
  
    fetchTeacherData(); // Appeler la fonction directement ici
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
      <Navbar role="TEACHER" />
      {/* Le contenu de la page dashboard */}
      <h1>Bienvenue sur le tableau de bord du professeur</h1>
      {/* Autres composants ou contenu de la page */}
    </div>
  );
};

export default TeacherDashboard;
