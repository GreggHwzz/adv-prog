import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface Form {
  id: string;
  courseId: string;
  adminId: string;
}

interface UseFormsReturn {
  forms: Form[];
  loading: boolean;
  error: string | null;
  fetchForms: (adminId?: string, courseId?: string) => Promise<void>;
}

export const useForms = (): UseFormsReturn & { deleteForm: (formId: string) => Promise<void> } => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForms = async (adminId?: string, courseId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {};
      if (adminId) params.adminId = adminId;
      if (courseId) params.courseId = courseId;

      const response = await axios.get<Form[]>(`${backendUrl}/forms`, { params });
      setForms(response.data);
      console.log(response.data);
    } catch (err: unknown) {
      console.error('Error fetching forms:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (formId: string) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${backendUrl}/forms/delete/${formId}`);
      setForms((prevForms) => prevForms.filter((form) => form.id !== formId)); // Mettre à jour localement
    } catch (err: unknown) {
      console.error('Error deleting form:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    forms,
    loading,
    error,
    fetchForms,
    deleteForm,
  };
};
