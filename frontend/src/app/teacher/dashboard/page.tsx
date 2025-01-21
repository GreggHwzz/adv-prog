"use client";

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
