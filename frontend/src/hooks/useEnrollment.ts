import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
}

interface UseEnrollmentReturn {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
  fetchEnrollments: (studentId: string) => Promise<void>;
}

export const useEnrollment = (): UseEnrollmentReturn => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async (studentId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<Enrollment[]>(`${backendUrl}/enrollment`, {
        params: { studentId },
      });
      setEnrollments(response.data);

    } catch (err: unknown) {
      console.error('Error fetching enrollments:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return {
    enrollments,
    loading,
    error,
    fetchEnrollments,
  };
};
