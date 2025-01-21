import { useState } from 'react';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const useStudentFormResponse = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentFormResponse = async (studentId: string, formId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${backendUrl}/forms/responses/${studentId}/${formId}`);
      return response.data;
    } catch (err) {
      setError("Erreur lors de la récupération des réponses.");
      console.error("Erreur:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchStudentFormResponse, loading, error };
};

export default useStudentFormResponse;