"use client";



// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/useAuth";
// import { useTeacher } from "@/hooks/useTeacher";
// import Navbar from "@/components/layout/NavBar";

// Définition du type Teacher
// interface Teacher {
//   id: string;
//   lname: string;
//   fname: string;
// }

// const TeacherDashboard: React.FC = () => {
//   const { user, loading: authLoading } = useAuth();
//   const { teachers, loading, error, fetchTeacherById } = useTeacher();
//   const [teacher, setTeacher] = useState<Teacher | null>(null); // Utilisation du type défini
//   const router = useRouter();

//   useEffect(() => {
//     const fetchTeacherData = async () => {
//       if (!authLoading && user) {
//         try {
//           const teacherData = await fetchTeacherById(user.id);
//           setTeacher(teacherData || null);
//         } catch (err) {
//           console.error("Erreur lors de la récupération de l'étudiant :", err);
//         }
//       }
//     };
  
//     fetchTeacherData(); // Appeler la fonction directement ici
//   }, [authLoading, user]); // Limiter les dépendances

//   if (authLoading || loading) {
//     return <div>Chargement...</div>;
//   }

//   if (!user) {
//     router.push("/");
//     return null;
//   }

//   return (
//     <div>
//       <Navbar role="TEACHER" />
//       {/* Le contenu de la page dashboard */}
//       <h1>Bienvenue sur le tableau de bord du professeur</h1>
//       {/* Autres composants ou contenu de la page */}
//     </div>
//   );
// };

// export default TeacherDashboard;


import React, { useState } from "react";
import { Link } from "react-router-dom";
import FeedbackList from "@/components/teacher/FeedbackList";
import StatsOverview from "@/components/teacher/StatsOverview";
import Navbar from "@/components/layout/NavBar";

const TeacherDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, content: "Très bon cours, mais manque de supports visuels.", read: false },
    { id: 2, content: "Excellent, très clair et précis !", read: true },
    { id: 3, content: "J'apprécie l'interaction pendant les cours.", read: false },
  ]);

  // Fonction pour marquer les feedbacks comme lus
  const markAsRead = (id: number) => {
    setFeedbacks((prevFeedbacks) =>
      prevFeedbacks.map((feedback) =>
        feedback.id === id ? { ...feedback, read: true } : feedback
      )
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Navbar role="TEACHER" />
      <h1 className="text-2xl font-bold mb-6">Tableau de bord enseignant</h1>

      {/* Section statistiques */}
      <div className="mb-6">
        <StatsOverview />
        <Link
          to="/teacher/stats"
          className="text-blue-500 hover:underline mt-2 block"
        >
          Voir les statistiques détaillées
        </Link>
      </div>

      {/* Section commentaires anonymes */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Commentaires anonymes</h2>
        <FeedbackList feedbacks={feedbacks} onMarkAsRead={markAsRead} />
      </div>
    </div>
  );
};

export default TeacherDashboard;
