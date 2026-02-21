import { Client } from '@/types/client';
import { env } from '../config/env';

export function getClient() {
  console.log(
    '[Server] getClient - API_SERVER_URL:',
    process.env.API_SERVER_URL,
  );
  return new Client(env.API_SERVER_URL);
}
