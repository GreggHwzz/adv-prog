import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() credentials: { email: string; password: string }) {
    const { email, password } = credentials;

    try {
      const result = await this.authService.signInWithEmailAndPassword(email, password);
      console.log('Connexion réussie avec email :', email);
      return result;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message);
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('signup')
  async signUp(@Body() userData: { email: string; password: string }) {
    const { email, password } = userData;

    try {
      const result = await this.authService.signUpWithEmailAndPassword(email, password);
      console.log('Inscription réussie avec email :', email);
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error.message);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
