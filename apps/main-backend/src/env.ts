import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(9090),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info'),

  APP_BASE_URL: z.string().url().default('http://localhost:9090'),
  WEB_BASE_URL: z.string().default('*'),

  // Legacy auth-stub secrets (kept for the template's auth feature). LeakSync
  // pairing does NOT use these — it uses DEVICE_JWT_SECRET below.
  JWT_ACCESS_SECRET: z.string().min(32).default('dev-only-access-secret-change-me-32chars'),
  JWT_REFRESH_SECRET: z.string().min(32).default('dev-only-refresh-secret-change-me-32char'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // MongoDB — pairs + items. Defaults to a local instance.
  MONGO_URI: z.string().default('mongodb://localhost:27017'),
  MONGO_DB_NAME: z.string().default('leaksync'),

  // Signs the long-lived device JWTs used for pairing (no accounts).
  DEVICE_JWT_SECRET: z.string().min(32).default('dev-only-device-jwt-secret-change-me-32c'),
});

export type Env = z.infer<typeof EnvSchema>;

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
  throw new Error(`Invalid environment variables:\n${issues}`);
}

export const env: Env = parsed.data;
