import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { categories, db, tasks } from "@/app/lib/drizzle";
import { NextApiRequest, NextApiResponse } from "next";
import { object } from "zod";
import { auth } from "@/app/auth";
import { eq } from "drizzle-orm";

// export async function GET() {
//   const session = await auth();
//   if (!session) {
//     return NextResponse.next();
//   }
//   try {
//     const result = await db.select().from(tasks).where(
//       // @ts-ignore
//       eq(tasks.userId, session.user.id)
//     );
//     console.log(result);
//     return NextResponse.json({ result }, { status: 200 });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }

export async function handlers(req: any) {
  const session = await auth();
  if (!session) {
    return NextResponse.json("No Session", { status: 500 });
  }
  if (req.method === "GET") {
    try {
      const result = await db.select().from(tasks).where(
        // @ts-ignore
        eq(tasks.userId, session.user.id)
      );
      return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
  if (req.method === "DELETE") {
    const request = await req.json();
    if (session && request.id) {
      try {
        const result = await db
          .delete(tasks)
          .where(eq(tasks.id, request.id))
          .returning();
        return NextResponse.json({ status: 200 });
      } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
    } else {
      return NextResponse.json("No Session", { status: 500 });
    }
  }
}

export const GET = handlers;
export const DELETE = handlers;
