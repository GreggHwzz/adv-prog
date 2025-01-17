"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useStudent } from "@/hooks/useStudent";
import Navbar from "@/components/layout/NavBar";

// Définition du type Student
interface Student {
  id: string;
  master: string;
  lname: string;
  fname: string;
}

const StudentDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { students, loading, error, fetchStudentById } = useStudent();
  const [student, setStudent] = useState<Student | null>(null); // Utilisation du type défini
  const router = useRouter();

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!authLoading && user) {
        try {
          const studentData = await fetchStudentById(user.id);
          setStudent(studentData || null);
        } catch (err) {
          console.error("Erreur lors de la récupération de l'étudiant :", err);
        }
      }
    };
  
    fetchStudentData(); // Appeler la fonction directement ici
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
      <Navbar role="STUDENT" />
      {/* Le contenu de la page dashboard */}
      <h1>Bienvenue sur le tableau de bord de l&apos;élève</h1>
      {/* Autres composants ou contenu de la page */}
    </div>
  );
};

export default StudentDashboard;
