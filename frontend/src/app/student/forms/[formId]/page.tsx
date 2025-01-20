"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { useAuth } from '@/hooks/useAuth';
import { useFormQuestions } from '@/hooks/useFormQuestions';
import { useQuestion } from '@/hooks/useQuestion';
import { useReview } from '@/hooks/useReview'; 
import axios from 'axios';
import { Question } from '@/types/Question';
import { EnrichedQuestion } from '@/types/EnrichedQuestion';
import { ReviewData } from '@/types/ReviewData';
import { ReviewsDictionary } from '@/types/ReviewDictionary';

const FormQuestionsPage = ({ params }: { params: { formId: string } }) => {
  const router = useRouter(); 
  const { user } = useAuth(); 
  const [combinedQuestions, setCombinedQuestions] = useState<EnrichedQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnriched, setIsEnriched] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null); 
  const [reviews, setReviews] = useState<{ [key: string]: { answer: number; commentary?: string } }>({}); 
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { fetchQuestionsByFormId } = useFormQuestions();
  const { fetchQuestionContentById } = useQuestion();
  const { createReview } = useReview(); // Hook pour créer la review
  const formId = params.formId; // Accéder directement à l'ID

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
            formQuestions.map(async (formQuestion: Question) => {
              const content = await fetchQuestionContentById(formQuestion.id);
              return {
                ...formQuestion,
                content: content || formQuestion.content, 
              } as EnrichedQuestion;
            })
          );
          setCombinedQuestions(enrichedQuestions);
          setIsEnriched(true);
        } else {
          setError('No questions found.');
        }
      } catch (err: unknown) {
        console.log('Erreur de chargement', err)
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (!isEnriched) {
      loadQuestions();
    }
  }, [formId, fetchQuestionsByFormId, fetchQuestionContentById, isEnriched]);

  useEffect(() => {
    const loadStudentFormResponse = async () => {
      if (user?.id && formId) {
        try {
          const { data } = await axios.get(`/api/forms/responses/${user.id}/${formId}`);
          if (data) {
            // Si une réponse existe déjà, remplir les réponses et commentaires
            const updatedReviews = data.reduce((acc: ReviewsDictionary, review: ReviewData) => {
              acc[review.question_id] = { answer: review.answer, commentary: review.commentary };
              return acc;
            }, {});
            setReviews(updatedReviews);
          }
        } catch (err) {
          console.log("Erreur de chargement de students responses", err)
          setError('Failed to load student responses.');
        }
      }
    };

    loadStudentFormResponse();
  }, [user?.id, formId]);

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
      for (const reviewData of reviewsToSubmit) {
        await createReview(reviewData);
      }
      setConfirmationMessage('Your reviews have been submitted successfully!');
      setSubmitError(null); 

      setTimeout(() => {
        setConfirmationMessage(null);
        router.push('/');
      }, 3000);
    } catch (err) {
      console.log("error", err)
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
                  value={reviews[question.id]?.answer || ''}
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
