import { useState } from "react";
import { useStudent } from "@/hooks/useStudent";
import { useTeacher } from "@/hooks/useTeacher";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/common/Modal";


const UserFormModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
    isOpen,
    onClose,
  }) => {
    const { createStudent } = useStudent();
    const { createTeacher } = useTeacher();
  
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<string>("");
    const [course, setCourse] = useState<string>("");
    const [master, setMaster] = useState<string>("");
  
    const handleCreate = async () => {
      if (!fname || !lname || !email || !password || !role) {
        alert("Tous les champs sont obligatoires.");
        return;
      }
  
      try {
        if (role === "STUDENT") {
          const student = { fname, lname, email, master }; 
          await createStudent(student, password, role);
          toast.success("Utilisateur créé avec succès !");
        } else if (role === "TEACHER") {
          const teacher = { fname, lname, email, course };
          await createTeacher(teacher, password, role);
          toast.success("Utilisateur créé avec succès !");
        }
        onClose();
      } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        toast.error("Échec de la création de l'utilisateur.");
      }
    };
  
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un utilisateur">
          <div>
            <input
              type="text"
              placeholder="Prénom"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="text"
              placeholder="Nom"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
    
            {/* Liste déroulante pour le rôle */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Sélectionnez un rôle</option>
              <option value="STUDENT">Étudiant</option>
              <option value="TEACHER">Enseignant</option>
            </select>
    
            {/* Champ spécifique pour les étudiants */}
            {role === "STUDENT" && (
              <input
                type="text"
                placeholder="Master"
                value={master}
                onChange={(e) => setMaster(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
            )}
    
            {/* Champ spécifique pour les enseignants */}
            {role === "TEACHER" && (
              <input
                type="text"
                placeholder="Cours"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              />
            )}
    
            <button
              onClick={handleCreate}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Créer
            </button>
          </div>
        </Modal>
        <ToastContainer />
      </>
    );
  };
  
  export default UserFormModal;