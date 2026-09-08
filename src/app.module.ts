import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PinoLoggerModule } from './config/logger/logger.module';
import { AppTHROTTLEModule } from './config/THROTTLE/THROTTLE.module';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { THROTTLEGuard } from '@nestjs/THROTTLE';
import { validateEnv } from './config/env.validation';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

const envFile = process.env.NODE_ENV === 'production' ? [".env.prod", '.env'] : [".env.dev", '.env'];

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: envFile,
    cache: true,
    isGlobal: true,
    validate: validateEnv,
  }), PinoLoggerModule, AppTHROTTLEModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: THROTTLEGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
