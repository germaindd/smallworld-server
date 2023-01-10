import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Stages } from './stages.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: process.env.STAGE == Stages.PROD,
    }),
  );
  const port = process.env.PORT;
  if (!port)
    throw new Error('PORT must be provided as an environment variable');
  await app.listen(port);
}
bootstrap();
