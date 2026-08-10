import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
 app.use(helmet());

app.enableCors({
  origin: [
    "http://localhost:3000",
    "http://10.197.68.2:3000",
    "http://192.168.1.12:3000",
    "http://192.168.1.30:3000",
  ],
  credentials: true,
});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Nexus HR API')
    .setDescription('Enterprise HR Management Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Nexus HR API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
