import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'node:http';
import { LoggerModule } from 'nestjs-pino';

@Module({
    imports: [LoggerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
            const isDev = configService.get<string>('NODE_ENV') === 'development';
            return {
                pinoHttp: {
                    level: isDev ? 'debug' : 'info',
                    transport: isDev ? {
                        target: 'pino-pretty',
                        options: {
                            singleLine: true,
                            translateTime: 'SYS:standard',
                            ignore: 'pid,hostname',
                            colorize: true,
                        },
                    } : undefined,

                    genReqId: (req, res) => {
                        const existing = req.headers['x-request-id'];
                        const id = existing ? randomUUID();
                        res.setHeader('x-request-id', id);
                        return id;
                    }         

                    redact: {
                        paths: ['req.headers.authorization', 'req.headers.cookie', 'req.headers.password', 'res.headers["set-cookie"]'],

                        censor: '[REDACTED]',
                    },
                    customProps: (req: IncomingMessage) => {
                        return {
                            userId: (req as IncomingMessage & { user?: { id: string } }).user?.id,
                        };
                    },
                },
            };
        }
    })]
})
export class PinoLoggerModule { }
