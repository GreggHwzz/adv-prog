// EnrollmentModal.tsx

import React, { useState } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { useStudent } from "@/hooks/useStudent";
import { useCourse } from "@/hooks/useCourse";
import { Button, Modal, Box, TextField, MenuItem, CircularProgress } from "@mui/material";

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ isOpen, onClose }) => {
  const { students } = useStudent();
  const { courses } = useCourse();
  const { enrollStudentInCourse } = useAdmin();
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await enrollStudentInCourse(selectedStudent, selectedCourse);
      onClose();
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription.");
      console.error("Erreur lors de l'inscription à un cours", err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={{ p: 4, backgroundColor: "white", width: 400, margin: "auto", mt: 10 }}>
        <h2>Inscrire un étudiant</h2>

        <TextField
          select
          fullWidth
          label="Sélectionner un étudiant"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          sx={{ mb: 2, mt: 2 }}
        >
          {students.map((student) => (
            <MenuItem key={student.id} value={student.id}>
              {student.fname} {student.lname}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="Sélectionner un cours"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          sx={{ mb: 2 }}
        >
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.id}>
              {course.name}
            </MenuItem>
          ))}
        </TextField>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !selectedStudent || !selectedCourse}
        >
          {loading ? <CircularProgress size={24} /> : "Inscrire"}
        </Button>
      </Box>
    </Modal>
  );
};

export default EnrollmentModal;
