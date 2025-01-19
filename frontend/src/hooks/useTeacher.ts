import { useState, useEffect } from 'react';
import axios from 'axios';
import { Teacher } from '@/types/Teacher';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface UseTeachersReturn {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  fetchTeachers: () => Promise<void>;
  fetchTeacherById: (id: string) => Promise<Teacher | undefined>;
  createTeacher: (teacher: Omit<Teacher, 'id'>, password: string, userRole: string) => Promise<Teacher | undefined>;
  updateTeacher: (id: string, updatedData: Partial<Teacher>) => Promise<Teacher | undefined>;
  deleteTeacher: (id: string) => Promise<void>;
}

export const useTeacher = (): UseTeachersReturn => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all teachers
  const fetchTeachers = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Teacher[]>(`${backendUrl}/teachers`);
      setTeachers(response.data);
    } catch (err: unknown) {
      console.error('Error fetching teachers:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherById = async (id: string): Promise<Teacher | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Teacher>(`${backendUrl}/teachers/${id}`);
      console.log("Fetched teacher:", response.data); // Log pour vérifier la réponse
      return response.data;
    } catch (err: unknown) {
      console.error('Error fetching teacher by ID:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  

  // Create a new teacher
  const createTeacher = async (teacher: Omit<Teacher, 'id'>, password: string, userRole: string): Promise<Teacher | undefined> => {
    setLoading(true);
    setError(null);
    try {
      // Envoie des données au backend
      const response = await axios.post<Teacher>(`${backendUrl}/teachers/create`, { ...teacher, password, userRole });
  
      // Ajout à la liste des enseignants dans le state
      setTeachers((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: unknown) {
      console.error('Error creating teacher:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Update a teacher
  const updateTeacher = async (
    id: string,
    updatedData: Partial<Teacher>
  ): Promise<Teacher | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put<Teacher>(`${backendUrl}/teachers/${id}`, updatedData);
      setTeachers((prev) =>
        prev.map((teacher) => (teacher.id === id ? response.data : teacher))
      );
      return response.data;
    } catch (err: unknown) {
      console.error('Error updating teacher:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a teacher
  const deleteTeacher = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${backendUrl}/teachers/delete/${id}`);
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
    } catch (err: unknown) {
      console.log('Error deleting teacher:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers(); // Fetch all teachers on component mount
  }, []);

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    fetchTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher,
  };
};

