import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  controllers: [ProfilesController], // Le contrôleur gère les endpoints
  providers: [ProfilesService],      // Le service gère la logique métier (si nécessaire)
  exports: [ProfilesService],        // Si d'autres modules doivent utiliser ce service
})
export class ProfilesModule {}
