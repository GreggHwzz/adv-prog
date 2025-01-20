import { useState, useEffect } from "react";
import axios from "axios";
import { Admin } from "@/types/Admin";
import { toast } from "react-toastify";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface UseAdminsReturn {
  admins: Admin[];
  loading: boolean;
  error: string | null;
  fetchAdmins: () => Promise<void>;
  fetchAdminById: (id: string) => Promise<Admin | undefined>;
  createAdmin: (admin: Omit<Admin, "id">) => Promise<Admin | undefined>;
  updateAdmin: (
    id: string,
    updatedData: Partial<Admin>,
  ) => Promise<Admin | undefined>;
  deleteAdmin: (id: string) => Promise<void>;
  enrollStudentInCourse : (studentId: string, courseId: string) => Promise<void>;
}

export const useAdmin = (): UseAdminsReturn => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all admins
  const fetchAdmins = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Admin[]>(`${backendUrl}/admins`);
      setAdmins(response.data);
    } catch (err: unknown) {
      console.error("Error fetching admins:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminById = async (id: string): Promise<Admin | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Admin>(`${backendUrl}/admins/${id}`);
      console.log("Fetched admin:", response.data);
      return response.data;
    } catch (err: unknown) {
      console.error("Error fetching admin by ID:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new admin
  const createAdmin = async (
    admin: Omit<Admin, "id">,
  ): Promise<Admin | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<Admin>(`${backendUrl}/admins`, admin);
      setAdmins((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: unknown) {
      console.error("Error creating admin:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Update a admin
  const updateAdmin = async (
    id: string,
    updatedData: Partial<Admin>,
  ): Promise<Admin | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put<Admin>(
        `${backendUrl}/admins/${id}`,
        updatedData,
      );
      setAdmins((prev) =>
        prev.map((admin) => (admin.id === id ? response.data : admin)),
      );
      return response.data;
    } catch (err: unknown) {
      console.error("Error updating admin:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Delete a admin
  const deleteAdmin = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${backendUrl}/admins/${id}`);
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    } catch (err: unknown) {
      console.error("Error deleting admin:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const enrollStudentInCourse = async (studentId: string, courseId: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/enrollment/enroll`, {
        studentId,
        courseId,
      });

      if (response.status === 201) {
        toast.success("Étudiant inscrit avec succès !");
      } else {
        throw new Error("Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Erreur lors de l'inscription.");
      toast.error("Erreur lors de l'inscription.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchAdmins(); // Fetch all admins on component mount
  }, []);

  return {
    admins,
    loading,
    error,
    fetchAdmins,
    fetchAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    enrollStudentInCourse,
  };
};
