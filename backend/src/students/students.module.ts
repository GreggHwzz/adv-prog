import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
  controllers: [StudentsController], // Le contrôleur gère les endpoints
  providers: [StudentsService],      // Le service gère la logique métier (si nécessaire)
  exports: [StudentsService],        // Si d'autres modules doivent utiliser ce service
})
export class StudentsModule {}
