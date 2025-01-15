import { useState, useEffect } from "react";
import { apiService } from "@/services/api.service";
import { FaPlus } from "react-icons/fa";

interface Question {
  id: number;
  text: string;
}

interface FormQuestionsProps {
  formId: number;
}

const FormQuestions: React.FC<FormQuestionsProps> = ({ formId }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await apiService.getQuestions(formId);
        setQuestions(response);
      } catch (error) {
        console.error("Erreur lors de la récupération des questions :", error);
      }
    };

    fetchQuestions();
  }, [formId]);

  const handleCreateQuestion = async () => {
    if (!newQuestionText) return;

    try {
      const response = await apiService.createQuestion(formId, { text: newQuestionText });
      setQuestions([...questions, response]);
      setNewQuestionText("");
    } catch (error) {
      console.error("Erreur lors de la création de la question :", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Questions du formulaire</h1>

      {/* Formulaire pour ajouter une question */}
      <div className="mb-6 flex">
        <input
          type="text"
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          className="border px-4 py-2 mr-4 rounded"
          placeholder="Texte de la question"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleCreateQuestion}
        >
          <FaPlus className="mr-2" /> Ajouter une question
        </button>
      </div>

      {/* Liste des questions */}
      <ul>
        {questions.map((question) => (
          <li key={question.id} className="mb-4">
            <div className="flex justify-between">
              <p>{question.text}</p>
              <div>
                <button className="text-blue-500">Modifier</button>
                <button className="text-red-500 ml-4">Supprimer</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormQuestions;
