'use client';

import { useEffect, useState } from 'react';
import { useFormQuestions } from '@/hooks/useFormQuestions';
import { useQuestion } from '@/hooks/useQuestion';

const FormQuestionsPage = ({ params }: { params: Promise<{ formId: string }> }) => {
  const [formId, setFormId] = useState<string | null>(null);  const [combinedQuestions, setCombinedQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnriched, setIsEnriched] = useState(false);  // Ajouter un état pour l'enrichissement

  const { fetchQuestionsByFormId } = useFormQuestions();
  const { fetchQuestionContentById } = useQuestion();

  // Résoudre le `formId` depuis `params`
  useEffect(() => {
    const resolveParams = async () => {

      try {
        const resolvedParams = await params;

        setFormId(resolvedParams.formId);  // Mettre à jour l'état formId
      } catch (err) {
        console.error('Error resolving params:', err);
      }
    };

    resolveParams();
  }, [params]);  // Exécuter l'effet à chaque fois que `params` change

  // Charger les questions si formId est défini
  useEffect(() => {
    const loadQuestions = async () => {
      if (!formId) return;


      setLoading(true);
      setError(null);

      try {

        const formQuestions = await fetchQuestionsByFormId(formId);


        if (formQuestions && formQuestions.length > 0) {


          // Enrichir les questions avec leur contenu
          const enrichedQuestions = await Promise.all(
            formQuestions.map(async (formQuestion: any) => {
              const content = await fetchQuestionContentById(formQuestion.id);
              return {
                ...formQuestion,
                content: content || formQuestion.content,
              };
            })
          );



          setCombinedQuestions(enrichedQuestions);  // Mettre à jour l'état des questions
          setIsEnriched(true);  // Marquer l'enrichissement comme terminé
        } else {
          console.error('No form questions found.');
          setError('No questions found.');
        }
      } catch (err: unknown) {
        console.error('Error loading questions:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (formId && !isEnriched) {  // Vérification pour ne pas refaire l'appel API
      loadQuestions();  // Appel pour charger les questions au démarrage
    }
  }, [formId, fetchQuestionsByFormId, fetchQuestionContentById, isEnriched]);

  // Affichage des états de chargement et d'erreur
  if (loading) {

    return <p>Loading questions...</p>;
  }

  if (error) {
    console.error('Error occurred:', error);
    return <p>{error}</p>;
  }



  return (
    <div>
      <h1>Form Questions</h1>
      <ul>
        {combinedQuestions.length > 0 ? (
          combinedQuestions.map((question) => (
            <li key={question.id}>
              <strong>{question.content}</strong> 
            </li>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </ul>
    </div>
  );
};

export default FormQuestionsPage;
