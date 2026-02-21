/**
 * The configuration to use for the app (loaded from the environment).
 *
 * This one is loaded from the server. See ./env.ts for more information.
 */
'use server';

import { env, isProduction as isProdServer } from '../config/env';

export async function getEnv() {
  return env;
}

export async function isProduction() {
  return await isProdServer();
}
