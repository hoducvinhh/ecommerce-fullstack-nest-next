import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { parseEnvOrigins } from './utils/parse-env-origins';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

const getCorsAllowList = (config: ConfigService) => {
  return parseEnvOrigins(config.get<string>('CLIENT_URL'), config.get<string>('CORS_OTHER_URL'));
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  app.use(cookieParser());

  const config = app.get(ConfigService);
  const logger = app.get(Logger);

  const allowList = getCorsAllowList(config);

  app.enableCors({
    origin: (
      requestOrigin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!requestOrigin) {
        callback(null, true);
        return;
      }

      if (allowList.includes(requestOrigin)) {
        callback(null, true);
        return;
      }

      logger.warn(
        `CORS blocked request from origin: ${requestOrigin} (not in allow list)`,
      );
      callback(null, false);
    },

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],

    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // api versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });


  const port = config.get<number>('PORT') ?? 8080;
  await app.listen(port);
  logger.log(`Server is running on port ${port}`);

}
bootstrap();
