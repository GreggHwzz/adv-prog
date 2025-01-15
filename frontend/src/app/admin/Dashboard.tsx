import { useEffect, useState } from "react";
import Navbar from "@/components/layout/NavBar";
import Loader from "@/components/common/Loader"; 
import QuestionnaireCard from "@/components/admin/QuestionnaireCard";
import { apiService } from "@/services/api.service";
import { Form } from "@/types/Form";

const AdminDashboard = () => {
  const [questionnaires, setQuestionnaires] = useState<Form[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const data = await apiService.getForms();
        setQuestionnaires(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des questionnaires :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaires();
  }, []); 

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-6">
      <Navbar role="ADMIN"/>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord - Administrateur</h1>
      
      {/* Affichage des questionnaires sous forme de cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {questionnaires.map((form) => (
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