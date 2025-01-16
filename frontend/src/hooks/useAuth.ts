import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);  // Initialisé à true pour indiquer qu'on charge les données
  const [error, setError] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${backendUrl}/auth/signin`, { email, password });
      const { user, token } = response.data;

      if (user && token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); // Sauvegarder l'utilisateur dans localStorage
        
        // Extraire le rôle de user_metadata directement
        const userRole = user.user_metadata?.userrole || 'authenticated'; // Si 'userrole' est absent, définir par défaut 'authenticated'
        localStorage.setItem('role', userRole); // Sauvegarder le rôle dans localStorage
        
        setUser(user);
        setRole(userRole);

        setLoading(false); // Fin du chargement
        return { user, token, role: userRole };
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Erreur lors de la connexion');
      setLoading(false); // Fin du chargement même en cas d'erreur
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
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');

    if (token && storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setLoading(false);  // Fin du chargement si l'utilisateur est déjà connecté
    } else {
      setLoading(false);  // Fin du chargement si l'utilisateur n'est pas trouvé
    }
  }, []);

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
