"use client"
import Navbar from "@/components/layout/NavBar";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Loader from "@/components/common/Loader";
import FormManager from '@/components/admin/FormManager';
import { useForms } from '../../../hooks/useForms';
import { useAuth } from '../../../hooks/useAuth';  // Importer le hook useAuth
import { useCourse } from '../../../hooks/useCourse';  // Importer le hook useCourse
// Données en dur simulant la récupération des formulaires
const mockForms = [
  { id: "1", title: "Formulaire de feedback" },
  { id: "2", title: "Formulaire d'inscription" },
  { id: "3", title: "Formulaire de satisfaction" },
];

const Forms = () => {
  // Simuler l'état de chargement et l'erreur
  const [newFormTitle, setNewFormTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const { user, loading: authLoading, error: authError } = useAuth();
  const { fetchForms, deleteForm, forms, loading, error } = useForms();
  const { fetchCourseById, courses, loading: courseLoading, error: courseError } = useCourse();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (user) {
      // Si user est disponible, on filtre par adminId
      fetchForms(user.id, '');

      setIsReady(true);  // On peut commencer à charger les données
    }
  }, [user]); // Ne s'exécute que lorsque 'user' change

  // Appeler fetchCourseById après avoir récupéré les formulaires
  useEffect(() => {
    if (forms.length > 0) {
      // Récupérer les cours associés aux formulaires
      forms.forEach(async (form) => {
        await fetchCourseById(form.courseId);  // Appeler fetchCourseById pour chaque cours
      });
    }
  }, [forms]);  // S'exécute uniquement lorsque 'forms' est mis à jour

  if (authLoading || loading || courseLoading) return <p>Loading forms...</p>;
  if (authError || error || courseError) return <p>Error loading forms: {authError || error || courseError}</p>;

  if (!isReady) return <p>Please wait while we load the data...</p>;

  
  const handleDelete = async (formId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce formulaire ?')) {
      await deleteForm(formId);
      alert('Formulaire supprimé avec succès.');
    }
  };
  

  return (
    <div>
      <Navbar role="ADMIN" />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Gestion des formulaires</h1>
  
        <FormManager />
  
        {/* Liste des formulaires */}
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Titre</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => {
              // Trouver le cours associé au formulaire
              const courseName = courses.find((course) => course.id === form.courseId)?.name;
  
              return (
                <tr key={form.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2">
                    <a href={`/admin/Forms/${form.id}`} className="text-blue-500 hover:underline">
                      {courseName ? `Course: ${courseName}` : `Course ID: ${form.courseId}`}
                    </a>
                  </td>
                  <td className="px-4 py-2">
                    
                    <button  onClick={() => handleDelete(form.id)} className="text-red-500 hover:underline mr-4">Supprimer</button>
                    
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
  
          }
  

export default Forms;
