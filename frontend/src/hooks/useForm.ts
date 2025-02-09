/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import { useQuestion } from './useQuestion'; // Importer le hook useQuestion

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface Form {
  id: string;
  courseId: string;
  adminId: string;
}

interface Question {
  id: string;
  content: string;
  is_custom: boolean;
}

interface UseFormReturn {
  createForm: (courseId: string, adminId: string, additionalQuestions: Omit<Question, 'id'>[]) => Promise<Form | undefined>;
  updateFormQuestions: (formId: string, updatedQuestionIds: string[]) => Promise<Form | undefined>;
}

export const useForm = (): UseFormReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { questionsToAdd } = useQuestion(); // Utilisation du hook useQuestion pour récupérer les questions par défaut

  // Créer un formulaire avec les questions par défaut et supplémentaires
  const createForm = async (
    courseId: string,
    adminId: string,
    additionalQuestions: Omit<Question, 'id'>[]
  ): Promise<Form | undefined> => {
    setLoading(true);
    setError(null);

    try {
      // 1. Vérifier si un formulaire existe déjà pour ce cours
      

      // 2. Créer un tableau des IDs des questions
      const allQuestionIds: string[] = [];

      // Ajouter les IDs des questions par défaut au tableau
      questionsToAdd.forEach((q) => {
        allQuestionIds.push(q.id);  // Ajouter uniquement l'ID
      });

      // 3. Créer les questions personnalisées et récupérer leurs IDs
      const createdQuestions = await Promise.all(
        additionalQuestions.map(async (question) => {
          const response = await axios.post<Question>(`${backendUrl}/questions/create`, {
            ...question,
            is_custom: true,
          });
          return response.data;
        })
      );

      // Ajouter les IDs des questions créées au tableau
      createdQuestions.forEach((q) => {
        allQuestionIds.push(q.id); // Ajouter uniquement l'ID
      });

      // 4. Créer le formulaire
      const formResponse = await axios.post<Form>(`${backendUrl}/forms/create`, {
        courseId,
        adminId,
      });

      const formId = formResponse.data.id;

      // 5. Associer les questions au formulaire via la table FormQuestions
      await Promise.all(
        allQuestionIds.map(async (questionId) => {
          await axios.post(`${backendUrl}/form-questions/create`, {
            formId,
            questionId,
          });
        })
      );

      return formResponse.data;
    } catch (err: unknown) {
      console.error('Error creating form:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour les questions d'un formulaire existant
  const updateFormQuestions = async (
    formId: string,
    updatedQuestionIds: string[]
  ): Promise<Form | undefined> => {
    setLoading(true);
    setError(null);

    try {
      // Mettre à jour les questions en les associant au formulaire via FormQuestions
      await Promise.all(
        updatedQuestionIds.map(async (questionId) => {
          await axios.put(`${backendUrl}/form-questions/update/${formId}/${questionId}`, {});
        })
      );

      // Retourner le formulaire mis à jour
      const formResponse = await axios.get<Form>(`${backendUrl}/forms/${formId}`);
      return formResponse.data;
    } catch (err: unknown) {
      console.error('Error updating form questions:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createForm,
    updateFormQuestions,
  };
};
