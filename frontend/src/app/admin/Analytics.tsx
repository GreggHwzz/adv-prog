import Navbar from "@/components/layout/NavBar";
import { useEffect, useState } from "react";
import { apiService } from "@/services/api.service"; // Fonction à implémenter pour récupérer les stats
import Loader from "@/components/common/Loader";
import StatCard from "@/components/admin/StatCard";
import { AnalyticsStats } from "@/types/AnalyticsStats";

const Analytics = () => {
  const [stats, setStats] = useState<AnalyticsStats>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getAnalyticsStats();
        setStats(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-6">
      <Navbar role="ADMIN"/>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      {/* Affichage des statistiques sous forme de cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard title="Total des Formulaires" value={stats?.totalForms} />
        <StatCard title="Total des Matières" value={stats?.totalSubjects} />
        <StatCard title="Évaluations Complètes" value={stats?.completedEvaluations} />
        <StatCard title="Professeurs Actifs" value={stats?.activeTeachers} />
      </div>
    </div>
  );
};

export default Analytics;