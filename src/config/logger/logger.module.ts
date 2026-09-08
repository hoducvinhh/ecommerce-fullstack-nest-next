import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'node:http';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { CORRELATION_ID_HEADER } from 'src/shared/constants/correlation-id';


@Module({
    imports: [LoggerModule.forRootAsync({
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
                        const existing = req.headers['CORRELATION_ID_HEADER'];
                        const id = existing ?? randomUUID();
                        req.headers['CORRELATION_ID_HEADER'] = id;
                        res.setHeader('CORRELATION_ID_HEADER', id);
                        return id;
                    },

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
