import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { categories, db, tasks as _tasks } from "@/app/lib/drizzle";
import { NextApiRequest, NextApiResponse } from "next";
import { object } from "zod";
import { auth } from "@/app/auth";
import { eq } from "drizzle-orm";

type CreateTaskRequest = {
  name: string;
  description: string;
  completed: boolean;
  time: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

async function handlers(req: any, res: NextApiResponse) {
  const session = await auth();
  if (!session) {
    return NextResponse.json("No Session", { status: 500 });
  }
  if (req.method === "POST") {
    try {
      const request = await req.json();
      request.createdAt = new Date();
      request.updatedAt = new Date();
      request.userId = session.user.id;
      const result = await db.insert(categories).values(request).returning();
      return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
  }
  if (req.method === "GET") {
    const session = await auth();
    if (session) {
      try {
        const tasks = await db
          .select()
          .from(categories)
          .where(eq(categories.userId, session.user.id as string));
        console.log(tasks);
        return NextResponse.json({ tasks }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
    } else {
      return NextResponse.json("No Session", { status: 500 });
    }
  }
  if (req.method === "DELETE") {
    const request = await req.json();
    console.log(request);
    if (session && request.id) {
      try {
        const result = await db
          .delete(categories)
          .where(eq(categories.id, request.id));
        return NextResponse.json({ status: 200 });
      } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
    } else {
      return NextResponse.json("No Session", { status: 500 });
    }
  }
  if (req.method === "PATCH") {
    const request = await req.json();
    if (session && request.id) {
      try {
        const result = await db
          .update(categories)
          .set({
            name: request.name,
            color: request.color,
            updatedAt: new Date(),
          })
          .where(eq(categories.id, request.id))
          .returning();
        return NextResponse.json({ result }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
    } else {
      return NextResponse.json("No Session", { status: 500 });
    }
  }
}

export const POST = handlers;
export const GET = handlers;
export const DELETE = handlers;
export const PATCH = handlers;
// export async function GET(req: any) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return NextResponse.json("No Session", { status: 500 });
//     }
//     //   if (req.method === "GET") {
//     try {
//       const result = await db.select().from(categories).where(
//         // @ts-ignore
//         eq(tasks.userId, session.user.id)
//       );
//       return NextResponse.json({ result }, { status: 200 });
//     } catch (error) {
//       return NextResponse.json({ error }, { status: 500 });
//     }
//     //   }
//   } catch (e) {
//     console.log(e);
//   }
// }
