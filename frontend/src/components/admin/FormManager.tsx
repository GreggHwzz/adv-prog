"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from '@/hooks/useForm'; // Hook pour la gestion des formulaires
import { useCourse } from '@/hooks/useCourse'; // Hook pour la gestion des cours
import { useAuth } from '@/hooks/useAuth'; // Hook pour la gestion de l'authentification
import { useQuestion } from '@/hooks/useQuestion'; // Hook pour la gestion des questions

type FormManagerProps = {
  onFormCreated?: (form: any) => void; // Callback appelé après la création d'un formulaire
};

const FormManager: React.FC<FormManagerProps> = ({ onFormCreated }) => {
  const { createForm } = useForm(); // Méthode pour créer un formulaire
  const { courses, loading: courseLoading, error: courseError } = useCourse(); // Liste des cours
  const { user, loading: authLoading } = useAuth(); // Utilisateur connecté
  const { questionsToAdd, loading: questionsLoading, error: questionsError } = useQuestion(); // Questions disponibles

  const [courseId, setCourseId] = useState<string>(''); // ID du cours sélectionné
  const [adminId, setAdminId] = useState<string>(''); // ID de l'administrateur
  const [additionalQuestions, setAdditionalQuestions] = useState<
    { content: string; is_custom: boolean }[]
  >([]); // Questions personnalisées

  useEffect(() => {
    if (user) {
      setAdminId(user.id); // Initialiser l'ID de l'administrateur
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
        if (onFormCreated) onFormCreated(createdForm);
      }
    } catch (err) {
      console.error('Erreur lors de la création du formulaire :', err);
    }
  };

  if (authLoading || courseLoading || questionsLoading) {
    return (
      <div className="flex justify-center items-center h-full bg-gray-100">
        <span>Chargement...</span>
      </div>
    );
  }

  if (courseError) {
    return <div className="text-red-500 p-4">{courseError}</div>;
  }

  if (questionsError) {
    return <div className="text-red-500 p-4">{questionsError}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Créer un nouveau formulaire</h2>

      {/* Sélection du cours */}
      <div className="mb-6">
        <label className="block text-gray-600 mb-2" htmlFor="course">
          Cours :
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
            <option
              key={course.id}
              value={course.id}
              className="bg-gray-100 text-gray-700"
            >
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Questions par défaut */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Questions par défaut</h3>
        {questionsToAdd.length > 0 ? (
          questionsToAdd
            .filter((question) => !question.is_custom)
            .map((question, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={question.content}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
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
    </div>
  );
};

export default FormManager;
