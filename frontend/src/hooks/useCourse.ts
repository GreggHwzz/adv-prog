import { useState, useEffect } from 'react';
import axios from 'axios';
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
// Définition du type pour un cours
interface Course {
  id: string;
  name: string;
  averageNote: number;
  teacherId: string;
}

export const useCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/courses`);
        setCourses(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des cours');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
};
