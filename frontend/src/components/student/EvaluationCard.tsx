import React from "react";

interface EvaluationCardProps {
  title: string;
  teacherName: string;
  dueDate: string; // j'ai mis les dates en string de base mais c'est ajustable bien sur
}

const EvaluationCard: React.FC<EvaluationCardProps> = ({ title, teacherName, dueDate }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg w-full p-4 mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">Enseignant: {teacherName}</p>
      <p className="text-gray-600">Avant le: {new Date(dueDate).toLocaleDateString()}</p>
    </div>
  );
};

export default EvaluationCard;
