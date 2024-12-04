import React, { useState } from 'react';
import responsesData from '@/data/response_adv-prog.json';
import formsData from '@/data/forms.json';

interface FormDetailsProps {
  formId: number;
  onBackToList: () => void;
}

interface StudentResponse {
  student: {
    id: number;
    name: string;
  };
  response: {
    rating: number;
    comment: string;
  };
  questionText: string;
}

interface QuestionRating {
  questionId: number;
  questionText: string;
  totalRating: number;
  numResponses: number;
  averagePercentage?: number;
  studentResponses: StudentResponse[];
}

const FormDetails: React.FC<FormDetailsProps> = ({ formId, onBackToList }) => {
  const [selectedQuestionResponses, setSelectedQuestionResponses] = useState<StudentResponse[] | null>(null);

  const formDetails = formsData.find((f) => f.id === formId);
  const courseResponses = responsesData;

  if (!formDetails) {
    return <div className="text-red-500 font-bold">Formulaire non trouvé.</div>;
  }

  const averageRatings: QuestionRating[] = formDetails.questions.map((question) => {
    const questionResponses = courseResponses.responses.flatMap(
      (response) => response.answers
        .filter((a) => a.questionId === question.id)
        .map(answer => ({
          student: response.student,
          response: answer.response,
          questionText: answer.questionText
        }))
    );

    const totalRating = questionResponses.reduce((sum, answer) => sum + answer.response.rating, 0);
    const numResponses = questionResponses.length;

    return {
      questionId: question.id,
      questionText: question.text,
      totalRating,
      numResponses,
      studentResponses: questionResponses,
      averagePercentage: numResponses > 0 ? (totalRating / (numResponses * 5)) * 100 : 0
    };
  });

  const handleShowResponses = (responses: StudentResponse[]) => {
    setSelectedQuestionResponses(responses);
  };

  const handleCloseResponses = () => {
    setSelectedQuestionResponses(null);
  };

  return (
    <div className={`relative w-full h-full flex transition-all duration-300 ease-in-out ${selectedQuestionResponses ? '-translate-x-full' : ''}`}>
      {/* Main Details Panel */}
      <div className="w-full flex-shrink-0 bg-white p-6 rounded-lg shadow space-y-6 h-full overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 pb-4 border-b">
          <h2 className="text-2xl font-bold text-[#1E0E62]">
            Résultats : {formDetails.courseTitle}
          </h2>
          <button
            onClick={onBackToList}
            className="absolute top-0 right-0 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
          >
            Retour
          </button>
        </div>

        <div className="space-y-4">
          {averageRatings.map((question) => (
            <div key={question.questionId} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">{question.questionText}</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-4 mr-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full" 
                    style={{ width: `${question.averagePercentage}%` }}
                  ></div>
                </div>
                <span className="text-gray-700 font-semibold">
                  {question.averagePercentage?.toFixed(1)}%
                </span>
              </div>
              <p 
                className="text-sm text-blue-600 mt-1 cursor-pointer hover:underline"
                onClick={() => handleShowResponses(question.studentResponses)}
              >
                Basé sur {question.numResponses} réponse(s)
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Responses Panel */}
      {selectedQuestionResponses && (
        <div className="absolute top-0 left-full w-full bg-white p-6 rounded-lg shadow h-full overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 pb-4 border-b mb-4">
            <h2 className="text-2xl font-bold text-[#1E0E62]">
              Détails des réponses
            </h2>
            <button
              onClick={handleCloseResponses}
              className="absolute top-0 right-0 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
            >
              Fermer
            </button>
          </div>

          {selectedQuestionResponses.map((studentResponse) => (
            <div 
              key={studentResponse.student.id} 
              className="bg-gray-50 p-4 rounded-lg mb-4"
            >
              <h3 className="text-lg font-semibold text-[#1E0E62]">
                {studentResponse.student.name}
              </h3>
              <p className="text-gray-700 mb-2">
                Note : {studentResponse.response.rating}/5
              </p>
              <p className="text-gray-600 italic">
                {studentResponse.response.comment || "(Pas de commentaires.)"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormDetails;