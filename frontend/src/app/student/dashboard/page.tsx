"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useStudent } from "@/hooks/useStudent";
import Navbar from "@/components/layout/NavBar";
import EvaluationCard from "@/components/student/EvaluationCard";
import StudentCard from "@/components/student/StudentCard";
import { Evaluation } from "@/types/Evaluation";
import Loader from "@/components/common/Loader";

// Définition du type Student
interface Student {
  id: string;
  master: string;
  lname: string;
  fname: string;
}

const StudentDashboard: React.FC = () => {

  // TODO : Ici faut correctement alimenter avec le back
  const { user, loading: authLoading } = useAuth();
  const { students, loading, error, fetchStudentById } = useStudent();
  const [student, setStudent] = useState<Student | null>(null); // Utilisation du type défini
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<any[]>([]); // TODO : a compléter pour récupérer les évals

  useEffect(() => {
    // Vérifiez si l'authentification est terminée et si l'utilisateur est défini
    if (!authLoading && user) {
      const fetchStudentData = async () => {
        try {
          const studentData = await fetchStudentById(user.id);
          setStudent(studentData || null);
        } catch (err) {
          console.error("Erreur lors de la récupération de l'étudiant :", err);
        }
      };
      fetchStudentData(); // Appel de la fonction pour récupérer les données de l'étudiant
    }
  }, [authLoading, user, fetchStudentById]); // Limitez les dépendances uniquement à ce qui est nécessaire
  

 

  if (!user && !authLoading) {
    router.push("/");
    return null;
  }
  

  // TODO : 
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Navbar role="STUDENT" />
      <div className="flex space-x-6">
        <StudentCard
          firstName={student?.fname}
          lastName={student?.lname}
          className={student?.master}
        />
        <div className="w-3/4 space-y-4">
          {evaluations.map((evaluation: Evaluation) => (
            <EvaluationCard
              key={evaluation.id}
              title={evaluation.title}
              teacherName={evaluation.professor}
              dueDate={evaluation.deadline}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
