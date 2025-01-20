"use client"

import React, { useState } from "react";
import { useStudent } from "@/hooks/useStudent";
import { useTeacher } from "@/hooks/useTeacher";
import UserFormModal from "@/components/admin/FormModal";
import EnrollmentModal from "@/components/admin/EnrollmentModal";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { toast } from "react-toastify";


const UserManagementPage: React.FC = () => {
  const { students, loading: loadingStudents, deleteStudent } = useStudent();
  const { teachers, loading: loadingTeachers, deleteTeacher } = useTeacher();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };


  const handleOpenEnrollmentModal = () => {
    setIsEnrollmentModalOpen(true);
  };

  const handleDeleteUser = async (id: string, role: "admin" | "student" | "teacher") => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        switch (role) {
          case "student":
            await deleteStudent(id);
            break;
          case "teacher":
            await deleteTeacher(id);
            break;
        }
        toast.success("Utilisateur supprimé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        toast.error("Erreur lors de la suppression de l'utilisateur.");
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTable = (data: any[], role: "admin" | "student" | "teacher") => (
    <TableContainer component={Paper} sx={{ mt: 4, maxWidth: "70%"}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: "20%", color: "#4f46e5", fontWeight: "bold", fontSize : "1.2rem" }} >Prénom</TableCell>
            <TableCell sx={{ width: "20%", color: "#4f46e5", fontWeight: "bold", fontSize : "1.2rem" }} >Nom</TableCell>
            <TableCell sx={{ width: "20%", color: "#4f46e5", fontWeight: "bold", fontSize : "1.2rem" }} >Email</TableCell>
            <TableCell sx={{ width: "10%", color: "#4f46e5", fontWeight: "bold", fontSize : "1.2rem" }} >Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id}>
              <TableCell sx={{fontWeight: "bold"}} >{user.fname}</TableCell>
              <TableCell sx={{fontWeight: "bold"}} >{user.lname}</TableCell>
              <TableCell sx={{fontWeight: "bold"}} >{user.email}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDeleteUser(user.id, role)}
                >
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <Box sx={{ p: 4, backgroundColor: "#f7fafc", minHeight: "100vh" }}>
      <Typography variant="h3" sx={{ mb: 4, fontWeight: "bold", color: "#2d3748" }}>
        Gestion des utilisateurs
      </Typography>

      {/* Bouton pour ouvrir le modal */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ boxShadow: 2 }}
          onClick={() => handleOpenModal()}
        >
          Ajouter un utilisateur
        </Button>

        <Button
          variant="contained"
          color="primary"
          sx={{ boxShadow: 2 }}
          onClick={handleOpenEnrollmentModal}
        >
          Inscrire un étudiant à un cours
        </Button>
      </Box>

      {/* Chargement ou affichage des données */}
      {loadingStudents || loadingTeachers ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold", color: "#4a5568" }}>
            Étudiants
          </Typography>
          {renderTable(students, "student")}

          <Typography variant="h5" sx={{ mt: 4, fontWeight: "bold", color: "#4a5568" }}>
            Enseignants
          </Typography>
          {renderTable(teachers, "teacher")}
        </>
      )}

      {/* Modal pour la création des utilisateurs */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Modal pour inscrire un étudiant */}
      <EnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
      />
    </Box>
    
    </>
  );
};

export default UserManagementPage;