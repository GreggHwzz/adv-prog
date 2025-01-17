/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import StatsCard from "@/components/student/StatsCard";
import CompletedEvaluationCard from "@/components/student/CompletedEvaluationCard";
import Loader from "@/components/common/Loader";

// TODO : Créer les bons types et enlever les lignes anti type any
const StudentHistory: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [completedEvaluations, setCompletedEvaluations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // TODO : Remplacer avec les bonnes routes une fois le back exposé
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const statsResponse = await fetch("/api/student/stats"); // Fake endpoint pour recup les stats
        const evaluationsResponse = await fetch("/api/student/completed-evaluations"); // Idem pour choper les questions completees
        const statsJson = await statsResponse.json();
        const evaluationsJson = await evaluationsResponse.json();

        setStats(statsJson);
        setCompletedEvaluations(evaluationsJson);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique :", error);
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Historique</h1>

      {/* Section des statistiques */}
      <div className="flex space-x-4">
        <StatsCard title="Évaluations complétées" value={stats.completedCount} icon={<i className="fas fa-check-circle"></i>} />
        <StatsCard title="Moyenne générale" value={`${stats.averageScore}/100`} icon={<i className="fas fa-chart-line"></i>} />
        <StatsCard title="Évaluations restantes" value={stats.remainingCount} icon={<i className="fas fa-hourglass-half"></i>} />
      </div>

      {/* Section des questionnaires complétés */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Questionnaires complétés</h2>
        {completedEvaluations.length > 0 ? (
          completedEvaluations.map((evaluation: any) => (
            <CompletedEvaluationCard
              key={evaluation.id}
              title={evaluation.title}
              teacherName={evaluation.teacherName}
              completedDate={evaluation.completedDate}
            />
          ))
        ) : (
          <p className="text-gray-600">Aucun questionnaire complété pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default StudentHistory;