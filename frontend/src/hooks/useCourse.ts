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
  const [course, setCourse] = useState<Course | null>(null);  // Ajout d'un état pour un cours spécifique
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer tous les cours
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

  // Récupérer un cours spécifique par son ID
  const fetchCourseById = async (courseId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/courses/${courseId}`);
      setCourse(response.data); // Mettre à jour l'état avec le cours spécifique
    } catch (err) {
      setError('Erreur lors de la récupération du cours');
    } finally {
      setLoading(false);
    }
  };

  return { courses, course, loading, error, fetchCourseById };
};
