import React from "react";

interface CompletedEvaluationCardProps {
  title: string;
  teacherName: string;
  completedDate: string; // Encore une fois j'ai mis des string ici mais ca peut se modifier hin
}

const CompletedEvaluationCard: React.FC<CompletedEvaluationCardProps> = ({ title, teacherName, completedDate }) => {
  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">Professeur: {teacherName}</p>
      <p className="text-gray-600">Date de complétion: {new Date(completedDate).toLocaleDateString()}</p>
    </div>
  );
};

export default CompletedEvaluationCard;