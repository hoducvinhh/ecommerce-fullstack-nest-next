import { ExceptionFilter } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

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
            const status = exception.getStatus();
            const resBody = exception.getResponse();
            if (typeof resBody === 'string') {
                return res.status(status).json({
                    statusCode: status,
                    message: resBody,
                    ...ctx
                });
            }
            if (typeof resBody === 'object' && resBody !== null) {
                return res.status(status).json({
                    statusCode: status,
                    ...resBody,
                    ...ctx
                });
            }

            //todo: build error payload
        }

        //unknown exception (database, etc)
        this.logger.error(
            {
                msg: `unhandled.exception`,
                requestId: ctx.requestId,
                path: ctx.path,
                error: exception instanceof Error ? exception.message : 'Unknown error',
                stack: exception instanceof Error ? exception.stack : 'No stack trace',
            }
        );

        //todo: build error payload
    }

}