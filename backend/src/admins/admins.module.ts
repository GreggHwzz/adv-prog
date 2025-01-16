import { Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';

@Module({
  controllers: [AdminsController], // Le contrôleur gère les endpoints
  providers: [AdminsService],      // Le service gère la logique métier (si nécessaire)
  exports: [AdminsService],        // Si d'autres modules doivent utiliser ce service
})
export class AdminsModule {}
