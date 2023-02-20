import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Stages } from './config/stages.enum';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: process.env.STAGE == Stages.PROD,
    }),
  );
  app.enableCors({});
  const port = process.env.PORT;
  if (!port)
    throw new Error('PORT must be provided as an environment variable');
  await app.listen(port, '0.0.0.0');
}
bootstrap();
