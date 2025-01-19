"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "@/components/common/Modal";
import Loader from "@/components/common/Loader";
import { useTeacher } from "@/hooks/useTeacher";
import { useStudent } from "@/hooks/useStudent";
import { Student } from "@/types/Student";
import { Teacher } from "@/types/Teacher";

type UserType = "STUDENT" | "TEACHER";

type CurrentUser = Omit<Student, 'id'> | Omit<Teacher, 'id'>;

const UserManagement = () => {
  const teacherHook = useTeacher();
  const studentHook = useStudent();

  const [users, setUsers] = useState<CurrentUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser|null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const teachers = await teacherHook.teachers;
        const students = await studentHook.students;

        const formattedTeachers = teachers.map((t) => ({ ...t, role: "TEACHER" }));
        const formattedStudents = students.map((s) => ({ ...s, role: "STUDENT" }));

        setUsers([...formattedTeachers, ...formattedStudents]);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [teacherHook, studentHook]);

  const openModal = (role: string, user: Partial<CurrentUser> | null = null) => {
    setCurrentUser({ ...user, role });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentUser(null);
    setIsModalOpen(false);
  };

  const handleCreateOrUpdate = async () => {
    if (!currentUser?.fname || !currentUser?.lname || !currentUser?.email || !currentUser?.role) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    const isUpdate = Boolean(currentUser.id);
    const hook = currentUser.role === "STUDENT" ? studentHook : teacherHook;

    const handleCreateUser = async () => {
        if (!currentUser) {
          alert("Veuillez sélectionner un utilisateur.");
          return;
        }
    
        try {
          if (currentUser.role === "STUDENT") {
            const student: Omit<Student, "id"> = {
              fname: currentUser.fname,
              lname: currentUser.lname,
              email: currentUser.email,
              master: currentUser.role,
            };
            await studentHook.createUser(student);
          } else if (currentUser.role === "TEACHER") {
            const teacher: Omit<Teacher, "id"> = {
              fname: currentUser.fname,
              lname: currentUser.lname,
              email: currentUser.email,
              course: currentUser.course,
            };
            await teacherHook.createTeacher(teacher);
          }
          alert("Utilisateur créé avec succès !");
        } catch (error) {
          console.error("Erreur lors de la création de l'utilisateur :", error);
          alert("Échec de la création de l'utilisateur.");
        }
      };

  const handleDelete = async (id: number, role: UserType) => {
    const hook = role === "STUDENT" ? studentHook : teacherHook;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await hook.deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>

      {/* Bouton d'ajout */}
      <button
        onClick={() => openModal("STUDENT")}
        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full mb-6"
      >
        <FaPlus className="mr-2" />
        Ajouter un étudiant
      </button>
      <button
        onClick={() => openModal("TEACHER")}
        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full mb-6 ml-4"
      >
        <FaPlus className="mr-2" />
        Ajouter un enseignant
      </button>

      {/* Liste des utilisateurs */}
      {loading ? (
        <Loader />
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Nom</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Rôle</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2">{`${user.fname} ${user.lname}`}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => openModal(user.role, user)}
                    className="text-blue-500"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, user.role)}
                    className="text-red-500 ml-4"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de création / édition */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentUser?.id ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
      >
        <div>
          <input
            type="text"
            placeholder="Prénom"
            value={currentUser?.fname || ""}
            onChange={(e) => setCurrentUser((prev) => ({ ...prev, fname: e.target.value }))}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="text"
            placeholder="Nom"
            value={currentUser?.lname || ""}
            onChange={(e) => setCurrentUser((prev) => ({ ...prev, lname: e.target.value }))}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={currentUser?.email || ""}
            onChange={(e) => setCurrentUser((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleCreateOrUpdate}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {currentUser?.id ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </Modal>
    </div>
  );
};
}

export default UserManagement;
