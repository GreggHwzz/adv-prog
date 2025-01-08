"use client"

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user : supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        const { data, error } = await supabase
          .from('user')
          .select('username')
          .eq('id', supabaseUser.id)
          .single();
        
        if (error) {
          console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
          setUser(supabaseUser);  
        } else {
          setUser({ ...supabaseUser, ...data });
        }
      }
      setLoading(false);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event : AuthChangeEvent, session : Session | null) => {
      if (session?.user) {
        const fetchUserData = async () => {
          const { data, error } = await supabase
            .from('user')
            .select('username')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Erreur lors de la récupération des données de l\'utilisateur:', error);
            setUser(session.user);
          } else {
            setUser({ ...session.user, ...data });
          }
        };
        
        fetchUserData();
      } else {
        setUser(null);
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, metadata?: object) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });

    if (error) throw error;
    return data;
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    signUp,
  };
}