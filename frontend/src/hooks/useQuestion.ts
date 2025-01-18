import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface Question {
  id: string;
  content: string;
  is_custom: boolean;
}

interface UseQuestionReturn {
  questionsToAdd: Question[];
  fetchDefaultQuestions: () => Promise<void>;
  fetchQuestionContentById: (questionId: string) => Promise<string | null>;
  loading: boolean;
  error: string | null;
}

export const useQuestion = (): UseQuestionReturn => {
  const [questionsToAdd, setQuestionsToAdd] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDefaultQuestions = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Question[]>(`${backendUrl}/questions`, { params: { is_custom: false } });

      if (response.status !== 200) {
        throw new Error('Failed to fetch default questions');
      }

      setQuestionsToAdd(response.data);
    } catch (err: unknown) {
      console.error('Error fetching default questions:', err);
      setError((err as Error).message || 'An error occurred while fetching default questions.');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionContentById = async (questionId: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Question>(`${backendUrl}/questions/${questionId}`);

      if (response.status !== 200) {
        throw new Error(`Failed to fetch question content for ID ${questionId}`);
      }

      return response.data.content;
    } catch (err: unknown) {
      console.error(`Error fetching content for questionId ${questionId}:`, err);
      setError((err as Error).message || 'An error occurred while fetching question content.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Charge les questions par défaut une seule fois au montage du hook
  useEffect(() => {
    fetchDefaultQuestions();
  }, []); // Dépendances vides pour éviter un appel infini

  return {
    questionsToAdd,
    fetchDefaultQuestions,
    fetchQuestionContentById,
    loading,
    error,
  };
};
