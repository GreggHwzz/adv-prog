import { Module } from '@nestjs/common';
import { FormsController } from './forms.controller';
import { FormsService } from './forms.service';

@Module({
  controllers: [FormsController], // Le contrôleur gère les endpoints
  providers: [FormsService],      // Le service gère la logique métier (si nécessaire)
  exports: [FormsService],        // Si d'autres modules doivent utiliser ce service
})
export class FormsModule {}
