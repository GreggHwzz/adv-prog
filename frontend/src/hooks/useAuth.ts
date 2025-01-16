import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/auth/signin`, { email, password });
      const { user, token } = response.data;

      if (user && token) {
        localStorage.setItem('token', token);
        setUser(user);

        
        await fetchUserProfile(user.id, token);
        return { user, token,role };
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/auth/signup`, { email, password });
      return response.data;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      //fetchUserProfileFromToken(token); // Utiliser la fonction modifiée pour récupérer le profil
    }
  }, []);

  // Fonction modifiée pour récupérer le profil à partir de l'ID utilisateur
  /*const fetchUserProfileFromToken = async (token: string) => {
    try {
      const response = await axios.get(`${backendUrl}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      await fetchUserProfile(response.data.id, token); // Récupérer le profil complet avec le rôle
    } catch (error) {
      setError('Erreur de récupération du profil utilisateur');
    }
  };*/

  // Nouvelle fonction pour récupérer les détails du profil à partir de l'ID utilisateur
  const fetchUserProfile = async (userId: string, token: string) => {
    try {
      const response = await axios.get(`${backendUrl}/profiles?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = response.data;
      console.log(profile[0].role)
      setRole(profile[0].role); // Récupérer le rôle du profil

    } catch (error) {
      setError('Erreur lors de la récupération du profil de l\'utilisateur');
    }
  };

  return {
    user,
    role,
    loading,
    error,
    signIn,
    signUp,
    logout,
  };
};
