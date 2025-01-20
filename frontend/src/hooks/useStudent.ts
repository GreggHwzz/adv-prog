import { useState, useEffect } from "react";
import axios from "axios";
import { Student } from "@/types/Student";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
interface UseStudentsReturn {
  students: Student[];
  loading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  fetchStudentById: (id: string) => Promise<Student | undefined>;
  createStudent: (
    student: Omit<Student, "id">,
    password: string,
    userRole: string,
  ) => Promise<Student | undefined>;
  updateStudent: (
    id: string,
    updatedData: Partial<Student>,
  ) => Promise<Student | undefined>;
  deleteStudent: (id: string) => Promise<void>;
}

export const useStudent = (): UseStudentsReturn => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all students
  const fetchStudents = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Student[]>(`${backendUrl}/students`);
      setStudents(response.data);
    } catch (err: unknown) {
      console.log("erreur student", err)
      console.error("Error fetching students:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentById = async (id: string): Promise<Student | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Student>(`${backendUrl}/students/${id}`);
      console.log("Fetched student:", response.data); // Log pour vérifier la réponse
      return response.data;
    } catch (err: unknown) {
      console.error("Error fetching student by ID:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (
    student: Omit<Student, "id">,
    password: string,
    userRole: string,
  ): Promise<Student | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<Student>(`${backendUrl}/students/create`, {
        ...student,
        password,
        userRole,
      });
      setStudents((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: unknown) {
      console.log("Error creating student:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Update a student
  const updateStudent = async (
    id: string,
    updatedData: Partial<Student>,
  ): Promise<Student | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put<Student>(
        `${backendUrl}/students/${id}`,
        updatedData,
      );
      setStudents((prev) =>
        prev.map((student) => (student.id === id ? response.data : student)),
      );
      return response.data;
    } catch (err: unknown) {
      console.error("Error updating student:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a student
  const deleteStudent = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${backendUrl}/students/delete/${id}`);
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (err: unknown) {
      console.error("Error deleting student:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(); // Fetch all students on component mount
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    fetchStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
  };
};
