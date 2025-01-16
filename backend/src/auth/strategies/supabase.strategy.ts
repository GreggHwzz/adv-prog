import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { supabaseClient } from '../../config/supabase'  // Assurez-vous que supabaseClient est configuré correctement

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
  public constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),  // Utilisez la clé secrète pour vérifier le JWT
    })
  }

  async validate(payload: any): Promise<any> {
    // Utilisez le payload pour récupérer l'utilisateur dans Supabase
    const { data, error } = await supabaseClient.auth.getUser(payload.sub);

    if (error) {
      throw new Error('Unauthorized');
    }

    // Si l'utilisateur est validé, renvoyez les informations utiles
    return { userId: payload.sub, email: payload.email };  // Vous pouvez ajuster les champs retournés selon vos besoins
  }

  authenticate(req) {
    super.authenticate(req);
  }
}
