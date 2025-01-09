import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or Key is not defined in environment variables');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (authError) {
      console.error('Erreur lors de la connexion avec Supabase:', authError.message);
      throw new Error('Connexion échouée : ' + authError.message);
    }
  
    const userId = authData.user?.id;
  
    if (!userId) {
      throw new Error('Utilisateur non trouvé après la connexion.');
    }
  
    // Récupération du rôle depuis la table profiles
    const { data: profileData, error: profileError } = await this.supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
  
    if (profileError) {
      console.error('Erreur lors de la récupération du rôle:', profileError.message);
      throw new Error('Impossible de récupérer le rôle de l’utilisateur.');
    }
  
    return {
      message: 'Connexion réussie',
      user: authData.user,
      token: authData.session?.access_token,
      role: profileData.role, 
    };
  }
  

  async signUpWithEmailAndPassword(email: string, password: string) {
    const redirectTo = this.configService.get<string>('FRONTEND_URL') + '/login';

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      console.error('Erreur lors de l\'inscription avec Supabase:', error.message);
      throw new Error('Inscription échouée : ' + error.message);
    }

    return {
      message: 'Inscription réussie, veuillez vérifier votre email pour confirmer.',
      user: data.user,
    };
  }
}

