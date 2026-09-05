import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import throttlerConfig from './throttler.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule.forFeature(throttlerConfig)],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const cfg = config.getOrThrow<{ ttl: number; limit: number }>('throttler');
                return {
                    throttlers: [{
                        name: 'default',
                        ttl: cfg.ttl,
                        limit: cfg.limit
                    }]
                };
            },
        }),
    ],
    exports: [ThrottlerModule],
})
export class AppThrottlerModule {

}
