import Navbar from "@/components/layout/NavBar";
import { useForms } from "@/hooks/useForms";
import { useCreateForm } from "@/hooks/useCreateForm";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Loader from "@/components/common/Loader";


//TODO : charger les questionnaires a partir d'un hook useForm qui va les récup correctement du back
const Forms = () => {
  const { forms, loading, error } = useForms();
  const { createForm, isCreating, creationError } = useCreateForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [newFormTitle, setNewFormTitle] = useState("");


  const handleCreateForm = async () => {
    if (!newFormTitle) return;
    await createForm(newFormTitle);
    setNewFormTitle(""); 
  };

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar role="ADMIN" />
        <div className="container mx-auto py-8">
          <p className="text-red-500">Erreur lors du chargement des formulaires : {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar role="ADMIN"/>
      <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des formulaires</h1>

      {/* Formulaire pour ajouter un nouveau formulaire */}
      <div className="mb-6 flex">
        <input
          type="text"
          value={newFormTitle}
          onChange={(e) => setNewFormTitle(e.target.value)}
          className="border px-4 py-2 mr-4 rounded"
          placeholder="Titre du formulaire"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCreateForm}
        >
          <FaPlus className="mr-2" /> Ajouter un formulaire
        </button>
      </div>

      {/* Liste des formulaires */}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Titre</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr key={form.id}>
                <td className="px-4 py-2">{form.title}</td>
                <td className="px-4 py-2">
                  <button className="text-blue-500">Modifier</button>
                  <button className="text-red-500 ml-4">Supprimer</button>
                  <button className="ml-4 text-green-500">Voir les questions</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </div>
  );
};

export default Forms;