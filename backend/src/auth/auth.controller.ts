import { Controller, Post,Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Connexion d'un utilisateur
   * @param credentials { email, password }
   */
  @Post('signin')
  async signIn(@Body() credentials: { email: string; password: string }) {
    const { email, password } = credentials;

    try {
      const result = await this.authService.signInWithEmailAndPassword(email, password);
      console.log('Connexion réussie avec email :', email);
      return result;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message);
      throw new HttpException(
        error.message || 'Erreur inconnue lors de la connexion.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Inscription d'un utilisateur
   * @param userData { email, password }
   */
  @Post('signup')
  async signUp(@Body() userData: { email: string; password: string }) {
    const { email, password } = userData;

    try {
      const result = await this.authService.signUpWithEmailAndPassword(email, password);
      console.log('Inscription réussie avec email :', email);
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error.message);
      throw new HttpException(
        error.message || 'Erreur inconnue lors de l\'inscription.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('user')
  async getUserProfile(@Body('token') token: string) {
    try {
      const profile = await this.authService.getProfile(token);
      return profile;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
