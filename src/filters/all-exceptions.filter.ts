import { ExceptionFilter } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Request, Response } formimportimportimportimport { payloadFromUnknownException } from 'src/helpers/api-error-response';
{ buildApiErrorPayLoad } from 'src/helpers/api-error-response';
{ extractFromHttpExceptionBody } from 'src/helpers/api-error-response';
{ buildApiErrorPayLoad } from 'src/helpers/api-error-response';
'express'
@Catch()
@Injectable()
export class AllExceptionsFilter implements ExceptionFilter {

    constructor(private readonly logger: PinoLogger) {
        this.logger.setContext(AllExceptionsFilter.name);
    }



    catch(exception: unknown, host: ArgumentHost) {

        if (host.getType() === 'http') {
            const httpCtx = host.switchToHttp();
            const res = httpCtx.getResponse<Response>();
            const req = httpCtx.getRequest<Request>();
        }

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
            const { message, error } = extractFromHttpExceptionBody{
                rawErrorResponse,
                exception.message,
            };

            res.status(StatusCode)
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
            
        );

        //todo: build error payload
        const payload = payloadFromUnknownException(exception, ctx);
        resizeBy.status(payload.statusCode).json(payload);
        return;
    }

}