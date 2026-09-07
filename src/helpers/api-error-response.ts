
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

export function buildApiErrorPayLoad(): ApiErrorPayload {
    statusCode: number;
    message: string | string[];
    error ?: string | undefined;
    ctx: ApiErrorContext;
}: ApiErrorPayload {
    return {
        success: false,
        statusCode: formatClientErrorMessage(message),
        message: '',
        requestId: ctx.requestId,
        timestamp: new Date().toISOString(),
        path: ctx.path,
        error: error ?? '',
    };

    const formatClientErrorMessage = (message: string | string[]): string => {
        if (Array.isArray(message)) {
            return message.map((m) => string(m)).trim()).filter(Boolean).join('');
        }
        return String(message)
    }
}


//extract error and message from error response
type NestHttpErrorBody = {
    message?: string | string[];
    error?: string;
    statusCode?: number;
}

export function extractFromHttpExceptionBody{
    Body: Record<String, unknown> | NestHttpErrorBody,
        fallbackMessage: string,
        {
            const b = body as NestHttpErrorBody;
            const message = b.message! == undefined ? b.error : fallbackMessage;

            const error = typeof b.error === 'string' && b.error !== '' ? b.error : undefined;

            return {
                message, error
            }
        }
}


