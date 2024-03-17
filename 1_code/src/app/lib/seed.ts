// import { sql } from '@vercel/postgres'
// import { db } from './drizzle'
// import { users, User, NewUser } from './drizzle'


// export async function seed() {
//   // Create table with raw SQL
//   const createTable = await sql.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         image VARCHAR(255),
//         "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//       );
//   `)
//   console.log(`Created "users" table`)

//   const insertedUsers: User[] = await db
//     .insert(UsersTable)
//     .values(newUsers)
//     .returning()
//   console.log(`Seeded ${insertedUsers.length} users`)

//   return {
//     createTable,
//     insertedUsers,
//   }
// }
