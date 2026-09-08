import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Injectable,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Request, Response } from 'express';
import { buildApiErrorPayLoad, payloadFromUnknownException } from 'src/shared/helpers/api-error-response';
import { extractFromHttpExceptionBody } from 'src/shared/helpers/api-error-response';

@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {

    constructor(private readonly logger: PinoLogger) {
        this.logger.setContext(AllExceptionsFilter.name);
    }

    catch(exception: unknown, host: ArgumentsHost) {
        if (host.getType() !== 'http') {
            this.logger.error(exception);
            return;
        }

        const httpCtx = host.switchToHttp();
        const res = httpCtx.getResponse<Response>();
        const req = httpCtx.getRequest<Request>();

        const ctx = {
            requestId: (req.headers['x-request-id'] as string) || '',
            path: req.url,
        }

        // http exception( not found, bad request, etc)
        if (exception instanceof HttpException) {
            const statusCode = exception.getStatus();
            const rawErrorResponse = exception.getResponse();

            if (typeof rawErrorResponse === 'string') {
                return res.status(statusCode).json(
                    buildApiErrorPayLoad(statusCode, rawErrorResponse, undefined, ctx),
                );
            }

            // resBody is an object 
            const { message, error } = extractFromHttpExceptionBody(
                rawErrorResponse,
                exception.message,
            );

            res.status(statusCode)
                .json(buildApiErrorPayLoad(statusCode, message, error, ctx));

            return;


        }

        //unknown exception (database, etc)
        this.logger.error(
            {
                msg: `unhandled.exception`,
                requestId: ctx.requestId,
                path: ctx.path,
                error: exception instanceof Error ? exception.message : 'Unknown error',
                stack: exception instanceof Error ? exception.stack : undefined,
            },
        );

        //todo: build error payload
        const payload = payloadFromUnknownException(exception, ctx);
        res.status(payload.statusCode).json(payload);
        return;
    }

}