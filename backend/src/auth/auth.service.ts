import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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

  /**
   * Sign in with email and password
   */
  async signInWithEmailAndPassword(email: string, password: string) {
    if (!email || !password) {
      throw new HttpException('Email and password are required.', HttpStatus.BAD_REQUEST);
    }

    const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (authError) {
      throw new HttpException(
        `Authentication failed: ${authError.message}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  
    const userId = authData.user?.id;
  
    if (!userId) {
      throw new HttpException('User not found after authentication.', HttpStatus.NOT_FOUND);
    }
  
    return {
      message: 'Sign-in successful',
      user: authData.user,
      token: authData.session?.access_token,
    };
  }
  
  /**
   * Sign up with email and password
   */
  async signUpWithEmailAndPassword(email: string, password: string) {
    if (!email || !password) {
      throw new HttpException('Email and password are required.', HttpStatus.BAD_REQUEST);
    }

    const redirectTo = this.configService.get<string>('FRONTEND_URL') + '/login';

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      throw new HttpException(
        `Sign-up failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Sign-up successful. Please check your email to confirm your account.',
      user: data.user,
    };
  }

  /**
   * Get profile details for the authenticated user
   */
  async getProfile(token: string) {
    if (!token) {
      throw new HttpException('Token is required.', HttpStatus.UNAUTHORIZED);
}

    const { data: user, error } = await this.supabase.auth.getUser(token);

    if (error || !user) {
      throw new HttpException(
        `Failed to fetch user profile: ${error?.message || 'Unknown error'}`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }
}
