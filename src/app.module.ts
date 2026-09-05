import { Module } from '@nestjs/common';
import { PinoLoggerModule } from './config/logger/logger.module';

const envFile = process.env.NODE_ENV === 'production' ? [".env.prod", '.env'] : [".env.dev", '.env'];

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: envFile,
    cache: true,
    isGlobal: true,
    validate: validateEnv,
  }), PinoLoggerModule],
})
export class AppModule { }
