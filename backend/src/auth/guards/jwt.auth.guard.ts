import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Ajouter ici des vérifications ou des validations supplémentaires si nécessaire
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException('You are not authorized to access this resource.');
    }
    return user; // Renvoie l'utilisateur validé pour utilisation dans les contrôleurs
  }
}
