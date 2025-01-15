import Navbar from "@/components/layout/NavBar";
import { apiService } from "@/services/api.service";
import { Form } from "@/types/Form";
import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

const Forms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newFormTitle, setNewFormTitle] = useState("");

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        const response = await apiService.getForms(); // À implémenter dans apiService
        setForms(response);
      } catch (error) {
        console.error("Erreur lors de la récupération des formulaires :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleCreateForm = async () => {
    if (!newFormTitle) return;

    try {
      const response = await apiService.createForm({ title: newFormTitle });
      setForms([...forms, response]);
      setNewFormTitle("");
    } catch (error) {
      console.error("Erreur lors de la création du formulaire :", error);
    }
  };

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