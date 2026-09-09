import { z } from 'zod';

export const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: z.coerce.number().default(8080),
    CLIENT_URL: z.string().optional(),
    CORS_OTHER_URL: z.string().optional(),

    //database configuration
    DB_HOST: z.string().min(1).trim(),
    DB_PORT: z.coerce.number().int().min(1).max(65535),
    DB_USERNAME: z.string().min(1).trim(),
    DB_PASSWORD: z.string().min(1).trim(),
    DB_NAME: z.string().min(1).trim(),

    //THROTTLE configuration
    THROTTLE_TTL_MS: z.coerce.number().default(1000),
    THROTTLE_LIMIT: z.coerce.number().default(60),
});


export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
    const parsed = envSchema.safeParse(config);
    if (!parsed.success) {
        const issues = parsed.error.issues.map((issue) => `${issue.path.join('.')} - ${issue.message}`).join('\n');
        throw new Error(`Environment validation failed:\n${issues}`);
    }
    return parsed.data;
}