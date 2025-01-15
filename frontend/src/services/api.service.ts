import { AnalyticsStats } from "@/types/AnalyticsStats";
import { Form } from "@/types/Form";
import { Question } from "@/types/Question";
import axios from "axios";

// Configuration d'Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erreur API :", error.response || error.message);
    return Promise.reject(error);
  }
);


export const apiService = {

    /**
     * Création d'un utilisateur
     * @param data - Les données de l'utilisateur à créer
     * @returns La réponse de l'API avec l'utilisateur créé
     */
    createUser: (data: { name: string; email: string; role: string }) =>
    api.post(`/users`, data),
  
    getUsers: () => api.get("/users"),

    addUser: (data: { name: string; email: string; role: string }) =>
        api.post("/users", data),
    
    deleteUser: (userId: number) => api.delete(`/users/${userId}`),

    /**
     * Mise à jour d'un utilisateur
     * @param userId - L'ID de l'utilisateur à mettre à jour
     * @param data - Les champs à modifier
     * @returns La réponse de l'API avec l'utilisateur mis à jour
     */
    updateUser: (userId: number, data: Partial<{ name: string; email: string; role: string }>) =>
        api.put(`/users/${userId}`, data),

    getEvaluations: () => api.get("/evaluations"),

    /**
     * Récupère tous les formulaires existants.
     * @returns Une promesse qui résout la liste des formulaires.
     */
    getForms: async (): Promise<Form[]> => {
        try {
        const response = await api.get("/forms");
        return response.data;
        } catch (error) {
        console.error("Erreur lors de la récupération des formulaires:", error);
        throw error;
        }
    },

    /**
     * Crée un nouveau formulaire.
     * @param formData Les données du formulaire à créer (ex: titre).
     * @returns Une promesse qui résout le formulaire créé.
     */
    createForm: async (formData: { title: string }): Promise<Form> => {
        try {
        const response = await api.post("/forms", formData);
        return response.data;
        } catch (error) {
        console.error("Erreur lors de la création du formulaire:", error);
        throw error;
        }
    },

    /**
     * Récupère toutes les questions d'un formulaire donné.
     * @param formId L'identifiant du formulaire pour lequel on souhaite récupérer les questions.
     * @returns Une promesse qui résout la liste des questions du formulaire.
     */
    getQuestions: async (formId: number): Promise<Question[]> => {
        try {
        const response = await api.get(`/forms/${formId}/questions`);
        return response.data;
        } catch (error) {
        console.error("Erreur lors de la récupération des questions:", error);
        throw error;
        }
    },

    /**
     * Crée une nouvelle question pour un formulaire spécifique.
     * @param formId L'identifiant du formulaire auquel la question sera ajoutée.
     * @param questionData Les données de la question (ex: texte de la question).
     * @returns Une promesse qui résout la question créée.
     */
    createQuestion: async (formId: number, questionData: { text: string }): Promise<Question> => {
        try {
        const response = await api.post(`/forms/${formId}/questions`, questionData);
        return response.data;
        } catch (error) {
        console.error("Erreur lors de la création de la question:", error);
        throw error;
        }
    },

    /**
     * Récupère les statistiques globales de l'application pour la page Analytics.
     * Cette fonction envoie une requête GET à l'API backend pour obtenir des données agrégées
     * telles que le nombre total de formulaires, de matières, d'évaluations complètes et de professeurs actifs.
     *
     * @returns {Promise<AnalyticsStats>} Une promesse qui résout les statistiques de l'application.
     * L'objet retourné contient les clés suivantes :
     * - `totalForms` : Nombre total de formulaires dans le système.
     * - `totalSubjects` : Nombre total de matières dans le système.
     * - `completedEvaluations` : Nombre d'évaluations complètes soumises par les étudiants.
     * - `activeTeachers` : Nombre de professeurs actifs ayant participé à la création ou validation de formulaires.
     *
     * @throws {Error} Lève une erreur si la récupération des données échoue.
     */
    getAnalyticsStats: async (): Promise<AnalyticsStats> => {
        try {
        
        const response = await api.get("/analytics");
        return response.data;
        } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
        throw error;
        }
    }
};
