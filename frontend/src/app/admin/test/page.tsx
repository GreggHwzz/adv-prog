"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { useCourse } from '@/hooks/useCourse'; // Import du hook useCourse
import { useAuth } from '@/hooks/useAuth';

const FormsPage: React.FC = () => {
  const { createForm, updateFormQuestions, questionsToAdd } = useForm(); // Récupérer les questions par défaut
  const { courses, loading: courseLoading, error: courseError } = useCourse();
  const { user, loading: authLoading } = useAuth();
  
  const [courseId, setCourseId] = useState<string>('');
  const [adminId, setAdminId] = useState<string>('');
  const [additionalQuestions, setAdditionalQuestions] = useState<{ content: string; is_custom: boolean }[]>([]);

  const [formId, setFormId] = useState<string>('');
  const [updatedQuestions, setUpdatedQuestions] = useState<string[]>([]); // Tableau d'IDs de questions

  useEffect(() => {
    if (user) {
      setAdminId(user.id); // Utilisation de l'adminId de l'utilisateur connecté
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
    if (!courseId || !adminId) {
      alert('Veuillez fournir un courseId et un adminId.');
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

  // Mise à jour des questions du formulaire
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

  if (authLoading || courseLoading) {
    return <div>Chargement...</div>;
  }

  if (courseError) {
    return <div>Erreur lors du chargement des cours : {courseError}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Gestion des Formulaires</h1>

      {/* Créer un formulaire */}
      <section>
        <h2>Créer un formulaire</h2>
        <div>
          <label>
            Course:
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              disabled={!courses.length}
            >
              <option value="">Sélectionnez un cours</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} 
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Affichage des questions par défaut */}
        <div>
          <h3>Questions par défaut</h3>
          {questionsToAdd.length > 0 ? (
            questionsToAdd
              .filter((question) => !question.is_custom) // Afficher uniquement les questions avec is_custom: false
              .map((question, index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={question.content}
                    readOnly
                    placeholder={`Question par défaut ${index + 1}`}
                  />
                </div>
              ))
          ) : (
            <p>Aucune question par défaut à afficher.</p>
          )}
        </div>

        {/* Questions personnalisées */}
        <div>
          <h3>Questions personnalisées</h3>
          {additionalQuestions.map((question, index) => (
            <div key={index}>
              <input
                type="text"
                value={question.content}
                onChange={(e) => handleUpdateQuestionContent(index, e.target.value)}
                placeholder={`Question personnalisée ${index + 1}`}
              />
            </div>
          ))}
          <button onClick={handleAddQuestion} style={{ border: '1px solid #ccc' }}>Ajouter une question</button>
        </div>
        <button onClick={handleCreateForm}>Créer le formulaire</button>
      </section>

      <hr />
      
      {/* Ajoutez un bouton ou une autre logique si vous souhaitez gérer la mise à jour des questions */}
    </div>
  );
};

export default FormsPage;
