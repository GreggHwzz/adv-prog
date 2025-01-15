import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { apiService } from "@/services/api.service";
import Modal from "../common/Modal";
import Loader from "../common/Loader";

interface User {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formLoading, setFormLoading] = useState<boolean>(false);
  
    useEffect(() => {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          const response = await apiService.getUsers();
          setUsers(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des utilisateurs :", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUsers();
    }, []);
  
    const openModal = (user: Partial<User> | null = null) => {
      setCurrentUser(user);
      setError(null); // Réinitialise les erreurs
      setIsModalOpen(true);
    };
  
    
    const closeModal = () => {
      setCurrentUser(null);
      setError(null);
      setIsModalOpen(false);
    };
  
    const handleSubmit = async () => {
        if (!currentUser?.name || !currentUser?.email || !currentUser?.role) {
          setError("Tous les champs sont obligatoires.");
          return;
        }
      
        setFormLoading(true);
        setError(null);
      
        try {
          if (currentUser.id) {
            await apiService.updateUser(currentUser.id, {
              name: currentUser.name,
              email: currentUser.email,
              role: currentUser.role,
            });
            setUsers((prev) =>
              prev.map((user) =>
                user.id === currentUser.id ? { ...user, ...currentUser } : user
              )
            );
          } else {
            const response = await apiService.createUser({
              name: currentUser.name,
              email: currentUser.email,
              role: currentUser.role,
            });
            setUsers((prev) => [...prev, response.data]);
          }
          closeModal();
        } catch (error) {
          console.error("Erreur lors de la soumission :", error);
          setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
          setFormLoading(false);
        }
      };
  
    const handleDelete = async (id: number) => {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
        try {
          await apiService.deleteUser(id);
          setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        }
      }
    };
  
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
  
        {/* Bouton pour ajouter un utilisateur */}
        <button
          onClick={() => openModal()}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-full mb-6"
        >
          <FaPlus className="mr-2" />
          Ajouter un utilisateur
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
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => openModal(user)}
                      className="text-blue-500"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
  
        {/* Modale */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={currentUser?.id ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
        >
          <div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
              type="text"
              placeholder="Nom"
              value={currentUser?.name || ""}
              onChange={(e) =>
                setCurrentUser((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="email"
              placeholder="Email"
              value={currentUser?.email || ""}
              onChange={(e) =>
                setCurrentUser((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full p-2 border rounded mb-4"
            />
            <select
              value={currentUser?.role || ""}
              onChange={(e) =>
                setCurrentUser((prev) => ({ ...prev, role: e.target.value as User["role"] }))
              }
              className="w-full p-2 border rounded mb-4"
            >
              <option value="" disabled>
                Sélectionner un rôle
              </option>
              <option value="ADMIN">Admin</option>
              <option value="TEACHER">Enseignant</option>
              <option value="STUDENT">Étudiant</option>
            </select>
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {formLoading ? <Loader /> : "Enregistrer"}
            </button>
          </div>
        </Modal>
      </div>
    );
  };
  
  export default UserManagement;