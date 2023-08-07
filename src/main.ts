import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Stages } from './config/stages.enum';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: process.env.STAGE == Stages.PROD,
    }),
  );

  const port = process.env.PORT;
  if (!port)
    throw new Error('PORT must be provided as an environment variable');

  await app.listen(port);
  logger.log(`App listening on port ${port}`);
}
bootstrap();
