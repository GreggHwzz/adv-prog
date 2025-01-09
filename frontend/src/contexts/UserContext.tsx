"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';

export type ExtendedUser = {
  id: string;
  email?: string;
  role?: string; // Le rôle récupéré depuis la base de données
  username?: string;
};

type UserContextType = {
  user: ExtendedUser | null;
  setUser: React.Dispatch<React.SetStateAction<ExtendedUser | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const cachedUser = localStorage.getItem('user');
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
        setLoading(false);
        return;
      }

      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        if (!supabaseUser.email) {
          console.warn("L'email de l'utilisateur n'est pas défini.");
          return;
        }

        // Récupérer le rôle de l'utilisateur à partir de la table 'users'
        const { data, error } = await supabase
          .from('users')
          .select('role, username') // Sélectionne le rôle et le nom d'utilisateur
          .eq('id', supabaseUser.id)
          .single();

        if (error) {
          console.warn("Erreur lors de la récupération du rôle de l'utilisateur:", error);
        }

        setUser({ ...supabaseUser, ...data }); // Ajoute le rôle et d'autres données de la table
        localStorage.setItem('user', JSON.stringify({ ...supabaseUser, ...data }));
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
