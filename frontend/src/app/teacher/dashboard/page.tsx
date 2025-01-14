"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";  // Utilisation de useRouter pour la redirection
import { useAuth } from "@/hooks/useAuth";    // Utilisation du hook useAuth
import Navbar from "@/components/layout/NavBar";

const TeacherDashboard = () => {
  const { user, loading } = useAuth();      // Récupérer l'utilisateur et l'état de chargement
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    // Afficher un message de chargement si l'état de l'utilisateur est en cours de récupération
    return <div>Chargement...</div>;
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
