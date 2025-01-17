import Navbar from "@/components/layout/NavBar";
import { useAnalyticsStats } from "@/hooks/useAnalyticsStats";
import Loader from "@/components/common/Loader";
import StatCard from "@/components/admin/StatCard";

const Analytics: React.FC = () => {
  const { stats, loading, error } = useAnalyticsStats(); // TODO : effacer que le hook existera

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center text-red-500">
        <h1 className="text-3xl font-bold mb-6">Erreur</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Navbar role="ADMIN"/>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      {/* Affichage des statistiques sous forme de cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <StatCard title="Total des Formulaires" value={stats?.totalForms || 0} />
        <StatCard title="Total des Matières" value={stats?.totalSubjects || 0} />
        <StatCard title="Évaluations Complètes" value={stats?.completedEvaluations || 0} />
        <StatCard title="Professeurs Actifs" value={stats?.activeTeachers || 0} />
      </div>
    </div>
  );
};

export default Analytics;