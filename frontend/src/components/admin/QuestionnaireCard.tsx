interface QuestionnaireCardProps {
    title: string;
    subject: string;
    teacherName: string;
  }
  
  const QuestionnaireCard: React.FC<QuestionnaireCardProps> = ({ title, subject, teacherName }) => {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">Matière : {subject}</p>
        <p className="text-gray-600">Professeur : {teacherName}</p>
      </div>
    );
  };
  
  export default QuestionnaireCard;
  