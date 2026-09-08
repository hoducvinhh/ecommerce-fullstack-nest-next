import { HttpStatus } from "@nestjs/common";

export type ApiErrorPayload = {
    success: false;
    statusCode: number;
    message: string | string[];
    error?: string;
    requestId?: string;
    timestamp?: string;
    path?: string;
}

export type ApiErrorContext = {
    requestId: string;
    path: string;
}

export function buildApiErrorPayLoad(
    statusCode: number,
    message: string | string[],
    error: string | undefined,
    ctx: ApiErrorContext,
): ApiErrorPayload {
    return {
        success: false,
        statusCode,
        message: formatClientErrorMessage(message),
        requestId: ctx.requestId,
        timestamp: new Date().toISOString(),
        path: ctx.path,
        error: error ?? '',
    };

    function formatClientErrorMessage(message: string | string[]): string {
        return Array.isArray(message)
            ? message.map(String).filter(Boolean).join(', ')
            : message;
    }
}


//extract error and message from error response
type NestHttpErrorBody = {
    message?: string | string[];
    error?: string;
    statusCode?: number;
}

export function extractFromHttpExceptionBody(
    body: Record<string, unknown> | NestHttpErrorBody,
    fallbackMessage: string,
): { message: string | string[]; error?: string } {
    const b = body as NestHttpErrorBody;
    return {
        message: b.message ?? fallbackMessage,
        error: typeof b.error === 'string' && b.error !== '' ? b.error : undefined,
    };
}

// unknown exception
export function payloadFromUnknownException(
    exception: unknown,
    ctx: ApiErrorContext,
): ApiErrorPayload {

    //todo translate error message

    const prod = process.env.NODE_ENV === 'production';
    if (exception instanceof Error) {
        return buildApiErrorPayLoad(
            HttpStatus.INTERNAL_SERVER_ERROR,
            prod ? 'Internal server error' : exception.message,
            'Internal server error',
            ctx,
        );
    }

    return buildApiErrorPayLoad(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        'Internal server error',
        ctx,
    );
}


