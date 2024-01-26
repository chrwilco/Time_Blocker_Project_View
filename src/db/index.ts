import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import { genSaltSync, hashSync } from 'bcrypt-ts';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

// @ts-ignore
export const db = drizzle(sql);

let users = pgTable('User', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 64 }),
    password: varchar('password', { length: 64 }),
});

export async function getUser(email: string) {
    return await db.select().from(users).where(eq(users.email, email));
}

export async function createUser(email: string, password: string) {
    let salt = genSaltSync(10);
    let hashedPassword = hashSync(password, salt);
    await db.insert(users).values({ email, password: hashedPassword });
}
