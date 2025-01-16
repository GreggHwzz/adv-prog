import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';

@Module({
  controllers: [TeachersController], // Le contrôleur gère les endpoints
  providers: [TeachersService],      // Le service gère la logique métier (si nécessaire)
  exports: [TeachersService],        // Si d'autres modules doivent utiliser ce service
})
export class TeachersModule {}
