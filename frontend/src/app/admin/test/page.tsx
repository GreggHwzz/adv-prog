"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from '@/hooks/useForm'; // Hook pour la gestion des formulaires
import { useCourse } from '@/hooks/useCourse'; // Hook pour la gestion des cours
import { useAuth } from '@/hooks/useAuth'; // Hook pour la gestion de l'authentification
import { useQuestion } from '@/hooks/useQuestion'; // Hook pour la gestion des questions

const FormsPage: React.FC = () => {
  const { createForm, updateFormQuestions } = useForm(); // Récupérer les méthodes pour créer et mettre à jour un formulaire
  const { courses, loading: courseLoading, error: courseError } = useCourse(); // Récupérer les cours
  const { user, loading: authLoading } = useAuth(); // Récupérer l'utilisateur authentifié
  const { questionsToAdd, loading: questionsLoading, error: questionsError } = useQuestion(); // Récupérer les questions par défaut et personnalisées

  const [courseId, setCourseId] = useState<string>(''); // État pour le cours sélectionné
  const [adminId, setAdminId] = useState<string>(''); // État pour l'ID de l'administrateur
  const [additionalQuestions, setAdditionalQuestions] = useState<{ content: string; is_custom: boolean }[]>([]); // Questions personnalisées

  const [formId, setFormId] = useState<string>(''); // État pour l'ID du formulaire
  const [updatedQuestions, setUpdatedQuestions] = useState<string[]>([]); // Questions à mettre à jour dans un formulaire existant

  useEffect(() => {
    if (user) {
      setAdminId(user.id); // Définir l'ID de l'administrateur une fois l'utilisateur chargé
    }
  }, [user]);

  const handleAddQuestion = () => {
    setAdditionalQuestions([
      ...additionalQuestions,
      { content: '', is_custom: true },
    ]);
  };

  const handleUpdateQuestionContent = (index: number, content: string) => {
    const updated = [...additionalQuestions];
    updated[index].content = content;
    setAdditionalQuestions(updated);
  };

  const handleCreateForm = async () => {
    if (!courseId) {
      alert('Veuillez choisir un cours');
      return;
    }

    const additionalQuestionsArray = additionalQuestions.map((question) => ({
      content: question.content,
      is_custom: true,
    }));

    try {
      const createdForm = await createForm(courseId, adminId, additionalQuestionsArray);

      if (createdForm) {
        alert('Formulaire créé avec succès !');
        console.log('Formulaire créé :', createdForm);
      }
    } catch (err) {
      console.error('Erreur lors de la création du formulaire :', err);
    }
  };

  const handleUpdateForm = async () => {
    if (!formId) {
      alert('Veuillez fournir un formId.');
      return;
    }

    try {
      const updatedForm = await updateFormQuestions(formId, updatedQuestions);

      if (updatedForm) {
        alert('Formulaire mis à jour avec succès !');
        console.log('Formulaire mis à jour :', updatedForm);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du formulaire :', err);
    }
  };

  if (authLoading || courseLoading || questionsLoading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100"><span>Chargement...</span></div>;
  }

  if (courseError) {
    return <div className="text-red-500 p-4">{courseError}</div>;
  }

  if (questionsError) {
    return <div className="text-red-500 p-4">{questionsError}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Gestion des Formulaires</h1>

        {/* Section pour la création d'un formulaire */}
        <section className="mb-8">

          
          {/* Sélection du cours */}
          <div className="mb-6">
            <label className="block text-gray-600 mb-2" htmlFor="course">
              Cours:
            </label>
            <select
              id="course"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
              disabled={!courses.length}
            >
              <option value="" className="text-gray-400 bg-gray-100">
                Sélectionnez un cours
              </option>
              {courses.map((course) => (
                <option key={course.id} value={course.id} className="bg-gray-100 text-gray-700">
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          {/* Affichage des questions par défaut */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Questions par défaut</h3>
            {questionsToAdd.length > 0 ? (
              questionsToAdd
                .filter((question) => !question.is_custom) // Afficher uniquement les questions par défaut
                .map((question, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      value={question.content}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      placeholder={`Question par défaut ${index + 1}`}
                    />
                  </div>
                ))
            ) : (
              <p>Aucune question par défaut à afficher.</p>
            )}
          </div>

          {/* Questions personnalisées */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Questions personnalisées</h3>
            {additionalQuestions.map((question, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={question.content}
                  onChange={(e) => handleUpdateQuestionContent(index, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder={`Question personnalisée ${index + 1}`}
                />
              </div>
            ))}
            <button
              onClick={handleAddQuestion}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 mt-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Ajouter une question
            </button>
          </div>

          <button
            onClick={handleCreateForm}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Créer le formulaire
          </button>
        </section>

        <hr className="my-8 border-gray-300" />

        
      </div>
    </div>
  );
};

export default FormsPage;
