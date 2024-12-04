"use client";

import React, { useState, useEffect } from "react";
import { HiDotsHorizontal } from "react-icons/hi"; 
import { FaTrashAlt } from "react-icons/fa"; 

type Questionnaire = {
  id: number;
  courseCode: string;
  courseTitle: string;
  professors: string[];
  deadline: string;
};

interface QuestionnaireListProps {
  initialQuestionnaires: Questionnaire[];
  onSelect: (id: number) => void; // Fonction pour rediriger vers le formulaire
  isAdmin?: boolean;
  searchQuery?: string; // Propriété ajoutée pour la recherche
};

const FormCard: React.FC<QuestionnaireListProps> = ({ initialQuestionnaires, onSelect, isAdmin, searchQuery }) => {
  const [questionnaires, setQuestionnaires] = useState(initialQuestionnaires);
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState(initialQuestionnaires);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<number | null>(null);

  // Fonction de filtrage
  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = initialQuestionnaires.filter((questionnaire) => {
        const courseTitle = questionnaire.courseTitle.toLowerCase();
        const professors = questionnaire.professors.join(" ").toLowerCase();
        return (
          courseTitle.includes(lowerCaseQuery) ||
          professors.includes(lowerCaseQuery)
        );
      });
      setFilteredQuestionnaires(filtered);
    } else {
      setFilteredQuestionnaires(initialQuestionnaires); // Réinitialiser quand la recherche est vide
    }
  }, [searchQuery, initialQuestionnaires]);

  const confirmDelete = () => {
    setQuestionnaires((prevQuestionnaires) =>
      prevQuestionnaires.filter((questionnaire) => questionnaire.id !== selectedQuestionnaireId)
    );
    setFilteredQuestionnaires((prevFiltered) =>
      prevFiltered.filter((questionnaire) => questionnaire.id !== selectedQuestionnaireId)
    );
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleDelete = (id: number) => {
    setSelectedQuestionnaireId(id);
    setShowDeleteConfirmation(true);
  };

  const handleEdit = (id: number) => {
    console.log(`Edit questionnaire with ID: ${id}`);
  };

  const handleCardClick = (id: number) => {
    onSelect(id);
  };

  return (
    <div className="p-4 py-0 space-y-4 w-[700px]">
      {filteredQuestionnaires.map((questionnaire) => (
        <div
          key={questionnaire.id}
          className="bg-white p-4 rounded-lg shadow relative hover:gray-100"
          onClick={() => handleCardClick(questionnaire.id)}
          onMouseEnter={() => setHoveredCard(questionnaire.id)}
          onMouseLeave={() => {
            setHoveredCard(null);
            setShowMenu(null); 
          }}
        >
          <h2 className="text-2xl font-bold text-[#1E0E62] truncate" style={{ maxWidth: "calc(100% - 40px)"}}>
            {questionnaire.courseCode} - {questionnaire.courseTitle}
          </h2>
          <p className="text-l text-gray-500">
            {questionnaire.professors.join(", ")}
          </p>
          <p className="text-l text-gray-400">
            Date : Avant le {questionnaire.deadline || "Non spécifiée"}
          </p>

          {/* Menu "..." pour les admins */}
          {isAdmin && hoveredCard === questionnaire.id && (
            <div
              className="absolute top-2 right-2"
              onClick={() => setShowMenu(questionnaire.id)}
            >
              <button className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full">
                <HiDotsHorizontal className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          )}

          {/* Menu dropdown */}
          {isAdmin && showMenu === questionnaire.id && (
            <div className="absolute top-10 right-2 bg-white border border-gray-200 shadow-lg rounded-md w-40 z-10">
              <button
                onClick={() => handleEdit(questionnaire.id)}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(questionnaire.id)}
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
              >
                <FaTrashAlt className="w-4 h-4 inline mr-2" />
                Supprimer
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Popup de confirmation de suppression */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-center text-[#1E0E62]">
              Attention !
            </h3>
            <p className="text-center mt-4 text-gray-600">
              Êtes-vous sûr de vouloir supprimer ce questionnaire ?
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={cancelDelete}
                className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormCard;
