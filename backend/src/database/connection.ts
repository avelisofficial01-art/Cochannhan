import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

const DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://co_dao:co_dao_dev@localhost:5432/co_dao';

const queryClient = postgres(DATABASE_URL);
export const db = drizzle(queryClient, { schema });

export type Database = typeof db;
