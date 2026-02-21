/**
 * The configuration to use for the app (loaded from the environment).
 *
 * **Warning**: If this is loaded from the client, it can only reflect the environment
 * variables set at **build time** not at **runtime** (ie, when running the server with
 * `npm start`).
 *
 * For this reason, I would probably recommend using `./serverEnv.ts` instead as this
 * will reflect the configuration from the current environment that the server is running
 * in.
 */
import z from 'zod';

export enum AppEnv {
  Development = 'development',
  Production = 'production',
}

function getAppEnv() {
  return process.env.APP_ENV || 'development';
}

export function isProduction() {
  return getAppEnv() === 'production';
}

const currentEnv = getAppEnv();
const isProd = isProduction();

const envSchema = z.object({
  API_SERVER_URL: z.string().url(),
  POSTHOG_HOST: z.string().url(),
  APP_ENV: z.nativeEnum(AppEnv),
  POSTHOG_KEY: isProd
    ? z.string().min(1, 'PostHog key is required in production')
    : z.string().optional().default('unused-key-for-development'),
});

console.log('[Client/Server] env.ts - API_SERVER_URL:', process.env.API_SERVER_URL);

const result = envSchema.safeParse({
  API_SERVER_URL: process.env.API_SERVER_URL || 'https://api.example.com',
  POSTHOG_KEY: process.env.POSTHOG_KEY,
  POSTHOG_HOST: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
  APP_ENV: currentEnv,
});

if (!result.success) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(result.error.format(), null, 2),
  );
  throw new Error('Invalid environment variables');
}

// "unsafe" way to do it. If called from the client, it will return build-time env variables
export const env = result.data;
