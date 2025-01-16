import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';

@Module({
  controllers: [CoursesController], // Le contrôleur gère les endpoints
  providers: [CoursesService],      // Le service gère la logique métier (si nécessaire)
  exports: [CoursesService],        // Si d'autres modules doivent utiliser ce service
})
export class CoursesModule {}
