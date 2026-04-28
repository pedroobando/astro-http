import { drizzle } from 'drizzle-orm/libsql/web';
import { createClient } from '@libsql/client';

export interface TursoEnv {
  TURSO_DATABASE_URL: string;
  TURSO_AUTH_TOKEN: string;
}

export function createDb(env: TursoEnv) {
  const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
  return drizzle({ client });
}

export { clients } from './schema';
