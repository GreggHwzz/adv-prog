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
import Loader from '@/components/common/Loader';
import { Box, Typography, TextField, Button, Grid, Snackbar } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const FormQuestionsPage = ({ params: paramsPromise }: { params: Promise<{ formId: string }> }) => {
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
  const [formId, setFormId] = useState<string | null>(null);

  // Extract formId from the Promise-based params
  useEffect(() => {
    paramsPromise
      .then((params) => {
        setFormId(params.formId);
      })
      .catch(() => {
        setError("Failed to retrieve form ID.");
      });
  });

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
          setError("No questions found.");
        }
      } catch (err: unknown) {

        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (formId && !isEnriched) {
      loadQuestions();
    }
  }, [formId, fetchQuestionsByFormId, fetchQuestionContentById, isEnriched]);

  // Charger les réponses existantes de l'étudiant
  useEffect(() => {
    const loadStudentFormResponse = async () => {
      if (user?.id && formId) {
        try {
          const { data } = await axios.get(`${backendUrl}/forms/responses/${user.id}/${formId}`);
          if (data) {
            const updatedReviews = data.reduce((acc: ReviewsDictionary, review: ReviewData) => {
              acc[review.question_id] = { answer: review.answer, commentary: review.commentary };
              return acc;
            }, {});
            setReviews(updatedReviews);
          }
        } catch (err) {

          toast.error("Echec de chargement des réponses !");
          setError("Failed to load student responses.");
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

      const studentFormResponse = {
        studentId: user.id,
        formId,
        isValid: true,
        isCompleted: true, 
        feedback: 'Feedback received',
        submittedAt: new Date().toISOString(),
      };

      const response = await axios.post(
        `${backendUrl}/forms/submit-response/${user.id}/${formId}`,
        studentFormResponse
      );



      setConfirmationMessage('Your reviews have been submitted successfully!');
      setSubmitError(null); 

      setTimeout(() => {
        setConfirmationMessage(null);
        router.push('/student/dashboard');
      }, 3000);
    } catch (err) {

      setSubmitError('Error submitting reviews. Please try again.');
    }
  };

  // Affichage des états de chargement et d'erreur
  if (loading) {
    return <Loader/>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Form Questions</Typography>
      {confirmationMessage && (
        <Snackbar
          color='green'
          open={true}
          message={confirmationMessage}
          autoHideDuration={3000}
          onClose={() => setConfirmationMessage(null)}
        />
      )}
      {submitError && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {submitError}
        </Typography>
      )}

      <Grid container spacing={3}>
        {combinedQuestions.map((question) => (
          <Grid item xs={12} sm={6} md={4} key={question.id}>
            <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">{question.content}</Typography>
              <Box sx={{ marginTop: 2 }}>
                <TextField
                  label="Rating (1-5)"
                  type="number"
                  InputProps={{
                    inputProps: { min: 1, max: 5 }
                  }}
                  fullWidth
                  value={reviews[question.id]?.answer || ''}
                  onChange={(e) => {
                    const answer = parseInt(e.target.value, 10);
                    handleAnswerChange(question.id, answer, reviews[question.id]?.commentary || '');
                  }}
                />
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <TextField
                  label="Commentary"
                  multiline
                  rows={4}
                  fullWidth
                  value={reviews[question.id]?.commentary || ''}
                  onChange={(e) => {
                    const commentary = e.target.value;
                    handleAnswerChange(question.id, reviews[question.id]?.answer || 1, commentary);
                  }}
                />
              </Box>
            </Box>
          </Grid>
        ))}
        <ToastContainer />
      </Grid>

      <Box sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitReviews}
          fullWidth
        >
          Submit All Reviews
        </Button>
      </Box>
    </Box>
    
  );
};

export default FormQuestionsPage;