import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Modal from "@/components/common/Modal";
import Loader from "@/components/common/Loader";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/User";

const UserManagement = () => {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const openModal = (user: Partial<User> | null = null) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentUser(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    if (!currentUser?.name || !currentUser?.email || !currentUser?.role) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    setFormLoading(true);
    try {
      if (currentUser.id) {
        await updateUser(currentUser.id, currentUser as User);
      } else {
        await createUser(currentUser as User);
      }
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
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
                  <button onClick={() => openModal(user)} className="text-blue-500">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-500 ml-4">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
            onChange={(e) => setCurrentUser((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="email"
            placeholder="Email"
            value={currentUser?.email || ""}
            onChange={(e) => setCurrentUser((prev) => ({ ...prev, email: e.target.value }))}
            className="w-full p-2 border rounded mb-4"
          />
          <select
            value={currentUser?.role || ""}
            onChange={(e) => setCurrentUser((prev) => ({ ...prev, role: e.target.value }))}
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
