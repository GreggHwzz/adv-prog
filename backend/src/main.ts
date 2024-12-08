import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Autoriser le frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Méthodes HTTP autorisées
    credentials: true, // Pour gérer les cookies/sessions si nécessaire
  };

  app.enableCors(corsOptions);

  // Lancer le serveur
  await app.listen(3500);
  console.log('Backend is running on http://localhost:3500');
}
bootstrap();
