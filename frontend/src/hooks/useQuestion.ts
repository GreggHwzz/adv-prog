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
  loading: boolean;
  error: string | null;
}

export const useQuestion = (): UseQuestionReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [questionsToAdd, setQuestionsToAdd] = useState<Question[]>([]);

  // Fonction pour récupérer les questions par défaut
  const fetchDefaultQuestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Question[]>(`${backendUrl}/questions`, { params: { is_custom: false } });
      setQuestionsToAdd(response.data);  // Mettre à jour les questions par défaut
    } catch (err: unknown) {
      console.error('Error fetching default questions:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Chargez les questions par défaut dès que le hook est initialisé
  useEffect(() => {
    fetchDefaultQuestions();
  }, []);  // Ne s'exécute qu'une seule fois lors du montage du composant

  return {
    questionsToAdd,
    fetchDefaultQuestions,
    loading,
    error,
  };
};
