import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PinoLoggerModule } from './config/logger/logger.module';
import { AppThrottlerModule } from './config/throttler/throttler.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { validateEnv } from './config/env.validation';

const envFile = process.env.NODE_ENV === 'production' ? [".env.prod", '.env'] : [".env.dev", '.env'];

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: envFile,
    cache: true,
    isGlobal: true,
    validate: validateEnv,
  }), PinoLoggerModule, AppThrottlerModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,

    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
