import axios from 'axios';

export const useReview = () => {
  const apiUrl = 'http://localhost:3500/reviews'; // URL de ton API NestJS

  // Créer une review
  const createReview = async (review: {
    answer: number;
    commentary?: string;
    questionId: string;
    studentId: string;
    formId: string;
  }) => {
    try {
      const response = await axios.post(`${apiUrl}/create`, review);
      return response.data; // Retourne la review créée
    } catch (error) {
      console.error('Error creating review:', error);
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  };

  // Récupérer toutes les reviews pour un formulaire spécifique
  const getReviewsByFormId = async (formId: string) => {
    try {
      const response = await axios.get(apiUrl, {
        params: { formId },
      });
      return response.data; // Retourne la liste des reviews
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  };

  // Récupérer une review par ID
  const getReviewById = async (id: string) => {
    try {
      const response = await axios.get(`${apiUrl}/${id}`);
      return response.data; // Retourne la review avec cet ID
    } catch (error) {
      console.error('Error fetching review by ID:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch review');
    }
  };

  // Mettre à jour une review
  const updateReview = async (id: string, updatedData: any) => {
    try {
      const response = await axios.put(`${apiUrl}/update/${id}`, updatedData);
      return response.data; // Retourne la review mise à jour
    } catch (error) {
      console.error('Error updating review:', error);
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  };

  // Supprimer une review
  const deleteReview = async (id: string) => {
    try {
      const response = await axios.delete(`${apiUrl}/delete/${id}`);
      return response.data; // Retourne la réponse de suppression
    } catch (error) {
      console.error('Error deleting review:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  return {
    createReview,
    getReviewsByFormId,
    getReviewById,
    updateReview,
    deleteReview,
  };
};
