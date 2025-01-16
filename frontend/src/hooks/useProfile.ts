// useProfile.ts
import { useState, useEffect } from 'react';
import axios from 'axios';

// Définition des types des données de profil
interface Profile {
  role: string; // Par exemple, supposons que le profil ne contienne que le champ 'role'
}

interface UseProfileResult {
  profile: Profile | null;
  error: string | null;
  loading: boolean;
}

const useProfile = (userId: string): UseProfileResult => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/Profiles/${userId}`);
        setProfile(response.data); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]); // Refaire la requête lorsque l'userId change

  return { profile, error, loading };
};

export default useProfile;
