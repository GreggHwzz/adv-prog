"use client"

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { AuthChangeEvent, User } from "@supabase/supabase-js";
import { useUser } from '@/contexts/UserContext'; 

export function useAuth() {
  const { user, setUser, loading, setLoading } = useUser(); 

  const fetchUser = async (supabaseUser: User) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username, role")
        .eq("id", supabaseUser.id)
        .single();

      if (error) throw new Error("Erreur lors de la récupération des données utilisateur");

      const userData = { ...supabaseUser, ...data };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error(err);
      const userData = { ...supabaseUser };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } else {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error(error);
          setLoading(false);
          return;
        }
        if (data?.session?.user) {
          fetchUser(data.session.user);
        } else {
          setLoading(false);
        }
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (session?.user) {
        fetchUser(session.user);
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { user: supabaseUser, session } = data;
    if (!supabaseUser || !session) return { user: null, session: null };

    await fetchUser(supabaseUser);

    return { user: { id: supabaseUser.id, email: supabaseUser.email, role: supabaseUser.role }, session };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUser(null);
    localStorage.removeItem('user');
  };

  return { user, loading, signIn, signOut };
}
