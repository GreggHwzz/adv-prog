import { useState } from 'react';
import axios from 'axios';
import { FormQuestions } from '@/types/FormQuestions';
import { Question } from '@/types/Question';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface UseFormQuestionsReturn {
  questions: Question[];
  loading: boolean;
  error: string | null;
  fetchQuestionsByFormId: (formId: string) => Promise<Question[]>;
}

export const useFormQuestions = (): UseFormQuestionsReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestionsByFormId = async (formId: string): Promise<Question[]> => {
    setLoading(true);
    setError(null);

    try {
      // Fetch the list of form-related question IDs
      const response = await axios.get<FormQuestions[]>(`${backendUrl}/form-questions`, {
        params: { formId },
      });

      if (response.status !== 200) {
        throw new Error(`Failed to fetch form questions: ${response.statusText}`);
      }

      // Fetch detailed content for each question
      const questionsData: Question[] = await Promise.all(
        response.data.map(async (formQuestion) => {
          try {
            const questionResponse = await axios.get<Question>(`${backendUrl}/questions/${formQuestion.questionId}`);
            if (questionResponse.status !== 200) {
              throw new Error(`Failed to fetch question content for ID ${formQuestion.questionId}`);
            }
            return questionResponse.data;
          } catch (err: unknown) {
            console.error(`Error fetching question ${formQuestion.questionId}:`, err);
            return {
              id: formQuestion.questionId,
              content: 'Error loading content',
              is_custom: false,
            } as Question; // Return a placeholder question on failure
          }
        })
      );

      setQuestions(questionsData);
      return questionsData;
    } catch (err: unknown) {
      console.error('Error fetching form questions:', err);
      setError((err as Error).message || 'An unknown error occurred');
      return []; // Return an empty array if there's an error
    } finally {
      setLoading(false);
    }
  };

  return {
    questions,
    loading,
    error,
    fetchQuestionsByFormId,
  };
};
