"use client"

import { useState, useEffect } from "react";
import FormManager from '@/components/admin/FormManager';
import { useForms } from '../../../hooks/useForms';
import { useAuth } from '../../../hooks/useAuth';  
import { useCourse } from '../../../hooks/useCourse'; 

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Link,
  Typography,
} from "@mui/material";


const Forms = () => {


  const { user, loading: authLoading, error: authError } = useAuth();
  const { fetchForms, deleteForm, forms, loading, error } = useForms();
  const { fetchCourseById, courses, loading: courseLoading, error: courseError } = useCourse();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (user) {
      // Si user est disponible, on filtre par adminId
      fetchForms(user.id, '');

      setIsReady(true);  // On peut commencer à charger les données
    }
  }, [user]); // Ne s'exécute que lorsque 'user' change

  // Appeler fetchCourseById après avoir récupéré les formulaires
  useEffect(() => {
    if (forms.length > 0) {
      // Récupérer les cours associés aux formulaires
      forms.forEach(async (form) => {
        await fetchCourseById(form.courseId);  // Appeler fetchCourseById pour chaque cours
      });
    }
  }, [forms]);  // S'exécute uniquement lorsque 'forms' est mis à jour

  if (authLoading || loading || courseLoading) return <p>Loading forms...</p>;
  if (authError || error || courseError) return <p>Error loading forms: {authError || error || courseError}</p>;

  if (!isReady) return <p>Please wait while we load the data...</p>;

  
  const handleDelete = async (formId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce formulaire ?')) {
      await deleteForm(formId);
      alert('Formulaire supprimé avec succès.');
    }
  };
  

  return (
    <div>
      <div className="container mx-auto py-8">
  
        <FormManager />
  
        {/* Liste des formulaires */}
        <Typography variant="h4" sx={{ mb: 4, mt: 4 ,fontWeight: "bold", color: "#2d3748" }}>
        Formulaires créés
      </Typography>
        <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", color: "#4f46e5", fontSize : "1.2rem" }}>Titre</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#4f46e5", fontSize : "1.2rem" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forms.map((form) => {
            // Trouver le cours associé au formulaire
            const courseName = courses.find((course) => course.id === form.courseId)?.name;

            return (
              <TableRow key={form.id} hover>
                <TableCell sx={{fontWeight: "bold", color :"#4f46e5"}}>
                  <Link
                    href={`/admin/Forms/${form.id}`}
                    underline="hover"
                  >
                    {courseName ? `Course: ${courseName}` : `Course ID: ${form.courseId}`}
                  </Link>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDelete(form.id)}
                    color="error"
                    variant="outlined"
                    size="small"
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
    </div>
  );
  
          }
  

export default Forms;
