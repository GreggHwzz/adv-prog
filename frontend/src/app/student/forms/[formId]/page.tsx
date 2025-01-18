'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import du router
import { useAuth } from '@/hooks/useAuth'; // Assure-toi que tu as ce hook
import { useFormQuestions } from '@/hooks/useFormQuestions';
import { useQuestion } from '@/hooks/useQuestion';
import { useReview } from '@/hooks/useReview'; // Assure-toi que ce hook existe

const FormQuestionsPage = ({ params }: { params: Promise<{ formId: string }> }) => {
  const router = useRouter(); // Initialisation du router
  const { user } = useAuth(); // Récupère l'utilisateur connecté
  const [formId, setFormId] = useState<string>('');
  const [combinedQuestions, setCombinedQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnriched, setIsEnriched] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null); // Message de confirmation
  const [reviews, setReviews] = useState<{ [key: string]: { answer: number; commentary?: string } }>({}); // Suivi des réponses et commentaires
  const [submitError, setSubmitError] = useState<string | null>(null); // Message d'erreur pour la soumission

  const { fetchQuestionsByFormId } = useFormQuestions();
  const { fetchQuestionContentById } = useQuestion();
  const { createReview } = useReview(); // Hook pour créer la review

  // Charger les questions à la construction du composant
  useEffect(() => {
    const loadQuestions = async () => {
      if (!formId) return;

      setLoading(true);
      setError(null);

      try {
        const formQuestions = await fetchQuestionsByFormId(formId);
        if (formQuestions && formQuestions.length > 0) {
          const enrichedQuestions = await Promise.all(
            formQuestions.map(async (formQuestion: any) => {
              const content = await fetchQuestionContentById(formQuestion.id);
              return {
                ...formQuestion,
                content: content || formQuestion.content,
              };
            })
          );
          setCombinedQuestions(enrichedQuestions); // Mettre à jour l'état des questions
          setIsEnriched(true); // Marquer l'enrichissement comme terminé
        } else {
          setError('No questions found.');
        }
      } catch (err: unknown) {
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!isEnriched) {
      loadQuestions();
    }
  }, [formId, fetchQuestionsByFormId, fetchQuestionContentById, isEnriched]);

  // Résoudre le `formId` depuis `params`
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setFormId(resolvedParams.formId);
    };

    resolveParams();
  }, [params]);

  // Mettre à jour les réponses et commentaires de chaque question
  const handleAnswerChange = (questionId: string, answer: number, commentary: string) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [questionId]: { answer, commentary }
    }));
  };

  // Soumettre l'ensemble des reviews
  const handleSubmitReviews = async () => {
    if (!user?.id || !formId) {
      setSubmitError('User ID or Form ID is missing');
      return;
    }

    // Vérifier que tous les ratings ont été remplis
    const missingRatings = combinedQuestions.some((question) => {
      const review = reviews[question.id];
      return !review || review.answer === undefined || review.answer < 1 || review.answer > 5;
    });

    if (missingRatings) {
      setSubmitError('Please provide a rating for all questions (1-5).');
      return;
    }

    const reviewsToSubmit = Object.keys(reviews).map((questionId) => ({
      answer: reviews[questionId].answer,
      commentary: reviews[questionId].commentary,
      questionId,
      formId,
      studentId: user.id,
    }));

    try {
      // Soumettre toutes les reviews d'un coup
      for (const reviewData of reviewsToSubmit) {
        await createReview(reviewData);
      }
      setConfirmationMessage('Your reviews have been submitted successfully!');
      setSubmitError(null); // Clear any previous errors

      // Réinitialiser le message après 3 secondes, puis rediriger
      setTimeout(() => {
        setConfirmationMessage(null);
        router.push('/'); // Redirige vers la racine de localhost:3500/
      }, 3000);
    } catch (err) {
      setSubmitError('Error submitting reviews. Please try again.');
    }
  };

  // Affichage des états de chargement et d'erreur
  if (loading) {
    return <p>Loading questions...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Form Questions</h1>
      {confirmationMessage && <p style={{ color: 'green' }}>{confirmationMessage}</p>}
      {submitError && <p style={{ color: 'red' }}>{submitError}</p>} {/* Affichage du message d'erreur */}

      <ul>
        {combinedQuestions.map((question) => (
          <li key={question.id}>
            <strong>{question.content}</strong>
            <div>
              <label>
                Rating (1-5):
                <input
                  type="number"
                  min="1"
                  max="5"
                  onChange={(e) => {
                    const answer = parseInt(e.target.value, 10);
                    handleAnswerChange(question.id, answer, reviews[question.id]?.commentary || '');
                  }}
                />
              </label>
            </div>
            <div>
              <label>
                Commentary:
                <textarea
                  value={reviews[question.id]?.commentary || ''}
                  onChange={(e) => {
                    const commentary = e.target.value;
                    handleAnswerChange(question.id, reviews[question.id]?.answer || 1, commentary);
                  }}
                />
              </label>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmitReviews}>Submit All Reviews</button>
    </div>
  );
};

export default FormQuestionsPage;
