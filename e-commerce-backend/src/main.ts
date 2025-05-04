import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Augmentation de la limite de taille des requêtes
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  
  // Activation de la validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Configuration CORS pour permettre les requêtes du frontend
  app.enableCors({
    origin: 'http://localhost:3000', // URL du frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Préfixe global pour toutes les routes API
  app.setGlobalPrefix('api');
  
  await app.listen(3001);
  console.log(`Application démarrée sur: http://localhost:3001/api`);
}
bootstrap();
