/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

export const useReview = () => {
  const apiUrl = 'http://localhost:3500';

  // Créer une review
  const createReview = async (review: any) => {
    try {
      const response = await axios.post(`${apiUrl}/reviews/create`, review);
      return response.data;
    } catch (error: any) {
      console.error('Error creating review:', error);
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  };

  // Mettre à jour l'état du formulaire (StudentFormResponse)
  const updateStudentFormResponse = async (responseId: any, data: any) => {
    try {
      const response = await axios.put(`${apiUrl}/student-form-response/update/${responseId}`, data);
      return response.data;
    } catch (error : any) {
      console.error('Error updating StudentFormResponse:', error);
      throw new Error(error.response?.data?.message || 'Failed to update StudentFormResponse');
    }
  };

  // Récupérer les reviews par formId
  const getReviewsByFormId = async (formId: any) => {
    try {
      const response = await axios.get(`${apiUrl}/reviews`, {
        params: { formId },
      });
      return response.data;
    } catch (error : any) {
      console.error('Error fetching reviews:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  };

  // Récupérer une review par ID
  const getReviewById = async (id: any) => {
    try {
      const response = await axios.get(`${apiUrl}/reviews/${id}`);
      return response.data;
    } catch (error : any) {
      console.error('Error fetching review by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch review');
    }
  };

  // Mettre à jour une review
  const updateReview = async (id: any, updatedData: any) => {
    try {
      const response = await axios.put(`${apiUrl}/reviews/update/${id}`, updatedData);
      return response.data;
    } catch (error : any) {
      console.error('Error updating review:', error);
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  };

  // Supprimer une review
  const deleteReview = async (id: any) => {
    try {
      const response = await axios.delete(`${apiUrl}/reviews/delete/${id}`);
      return response.data;
    } catch (error : any) {
      console.error('Error deleting review:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  // Marquer un formulaire comme complété
  const markFormAsCompleted = async (studentId: any, formId: any, feedback: any) => {
    try {
      const response = await axios.post(`${apiUrl}/student-form-response/complete`, {
        studentId,
        formId,
        isCompleted: true,
        submittedAt: new Date().toISOString(),
        feedback,
      });
      return response.data;
    } catch (error : any) {
      console.error('Error marking form as completed:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark form as completed');
    }
  };

  return {
    createReview,
    getReviewsByFormId,
    getReviewById,
    updateReview,
    deleteReview,
    updateStudentFormResponse,
    markFormAsCompleted,
  };
};
