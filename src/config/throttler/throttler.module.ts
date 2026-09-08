import { Module } from '@nestjs/common';
import { THROTTLEModule } from '@nestjs/THROTTLE';
import THROTTLEConfig from './THROTTLE.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        THROTTLEModule.forRootAsync({
            imports: [ConfigModule.forFeature(THROTTLEConfig)],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const cfg = config.getOrThrow<{ ttl: number; limit: number }>('THROTTLE');
                return {
                    THROTTLEs: [{
                        name: 'default',
                        ttl: cfg.ttl,
                        limit: cfg.limit
                    }]
                };
            },
        }),
    ],
    exports: [THROTTLEModule],
})
export class AppTHROTTLEModule {

}
