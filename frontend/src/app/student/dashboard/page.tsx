/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useStudent } from "@/hooks/useStudent";
import { useForms } from "@/hooks/useForms"; 
import useStudentFormResponse from "@/hooks/useStudentFormResponse"; // Import du hook pour récupérer les réponses
import StudentCard from "@/components/student/StudentCard";
import { Form } from "@/types/Form";
import Link from "next/link";
import { Student } from "@/types/Student";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'

const StudentDashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { fetchStudentById } = useStudent();
  const { fetchFormsForStudent } = useForms();  
  const { fetchStudentFormResponse } = useStudentFormResponse(); // Hook pour récupérer les réponses
  const [student, setStudent] = useState<Student | null>(null); 
  const [forms, setForms] = useState<Form[]>([]); 
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      const fetchStudentData = async () => {
        try {
          const studentData = await fetchStudentById(user.id);
          setStudent(studentData || null);
        } catch (err) {
          console.error("Erreur lors de la récupération de l'étudiant :", err);
        }
      };
      fetchStudentData();
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (user) {
      const fetchStudentForms = async () => {
        try {
          const studentForms = await fetchFormsForStudent(user.id);

          // Vérifier l'état de chaque formulaire (s'il est complété)
          const formsWithStatus = await Promise.all(
            studentForms.map(async (form) => {
              const response = await fetchStudentFormResponse(user.id, form.id);
              return {
                ...form,
                isCompleted: response ? response.isValid : false, // Si la réponse existe, on la marque comme remplie
              };
            })
          );

          setForms(studentForms || []);
          
        } catch (err) {
          console.error("Erreur lors de la récupération des formulaires :", err);
        }
      };
      fetchStudentForms();
    }
  }, [fetchFormsForStudent, user]);

  if (!user && !authLoading) {
    router.push("/");
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex space-x-6">
        <StudentCard
          firstName={student?.fname}
          lastName={student?.lname}
          className={student?.master}
        />
        <div className="w-3/4 space-y-4 ">
          <h2 className="text-xl font-bold">Formulaires</h2>
          {forms.length === 0 && <p>Aucun formulaire à afficher pour le moment.</p>}
          {forms.map((form) => (
            <div key={form.id} className="bg-white p-4 shadow-lg rounded-lg flex flex-col">
              <h3 className="text-lg font-bold mb-3">{form.title}</h3>
              <h2 className="text-lg mb-3"> Mr. {form.teacherName}</h2>
              <span
                className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${
                  form.isCompleted ? "bg-green-100 text-green-800" : "bg-red-100 text-yellow-800"
                }`}
              >
                {form.isCompleted ? (
                  <>
                    <CheckCircleIcon sx={{ fontSize: 18, color: 'green' }} />
                    <span className="ml-2">Rempli</span>
                  </>
                ) : (
                  <>
                    <HourglassEmptyIcon sx={{ fontSize: 18, color: 'red' }} />
                    <span className="ml-2">Non rempli</span>
                  </>
                )}
              </span>
              <Link href={`forms/${form.id}`} replace>
              {!form.isCompleted ? (<p className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">Remplir le questionnaire</p>) : <></> }
                
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;