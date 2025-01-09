import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ExtendedUser } from "@/contexts/UserContext"; 
import { Session, WeakPassword } from '@supabase/supabase-js'; // Importer les types nécessaires

// Typage des réponses de connexion et inscription
type SignInResponse = {
  user: ExtendedUser | null;
  session: Session | null;
  weakPassword?: WeakPassword;
};


type UserContextType = {
  user: ExtendedUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  signOut: () => Promise<void>;
  
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const user = useAuth(); // Hook de gestion de l'authentification

  return (
    <UserContext.Provider value={user}>
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
