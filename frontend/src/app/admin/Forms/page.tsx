"use client"
import Navbar from "@/components/layout/NavBar";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Loader from "@/components/common/Loader";
import FormManager from '@/components/admin/FormManager';

// Données en dur simulant la récupération des formulaires
const mockForms = [
  { id: "1", title: "Formulaire de feedback" },
  { id: "2", title: "Formulaire d'inscription" },
  { id: "3", title: "Formulaire de satisfaction" },
];

const Forms = () => {
  // Simuler l'état de chargement et l'erreur
  const [loading, setLoading] = useState<boolean>(false);
  const [newFormTitle, setNewFormTitle] = useState("");
  const [forms, setForms] = useState(mockForms);
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const handleFormCreated = (form) => {
    console.log('Formulaire créé avec succès :', form);
  };



  return (
    <div>
      <Navbar role="ADMIN" />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Gestion des formulaires</h1>

        <FormManager onFormCreated={handleFormCreated} />

        {/* Liste des formulaires */}
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
      </div>
    </div>
  );
};

export default Forms;
