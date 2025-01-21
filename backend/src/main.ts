import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration CORS
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',  // Autorise le frontend sur localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],  // Méthodes HTTP autorisées
    credentials: true,  // Gérer les cookies/sessions
  };

  app.enableCors(corsOptions);

  

  // Démarrer l'application NestJS sur port 3500
  await app.listen(3500);

}
bootstrap();
