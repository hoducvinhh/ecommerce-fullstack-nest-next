import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const cfg = config.getOrThrow<{ ttl: number; limit: number }>('THROTTLE');
                return {
                    throttlers: [{
                        name: 'default',
                        ttl: cfg.ttl,
                        limit: cfg.limit
                    }],
                };
            },
        }),
    ],
    exports: [ThrottlerModule],
})
export class AppThrottlerModule {

}
