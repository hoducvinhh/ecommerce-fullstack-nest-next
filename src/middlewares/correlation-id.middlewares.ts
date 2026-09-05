import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

export const CORRELATION_ID_HEADER = 'x-request-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {
        const existing = req.headers[CORRELATION_ID_HEADER];
        const requestId = existing ? randomUUID();
        req.headers[CORRELATION_ID_HEADER] = requestId;
        res.setHeader(CORRELATION_ID_HEADER, requestId);
        next();
    }
}