import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { db, tasks } from "@/app/lib/drizzle";
import { NextApiRequest, NextApiResponse } from "next";
import { object } from "zod";
import { auth } from "@/app/auth";

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
  console.log(session);
  if (req.method === "POST") {
    try {
      const request = await req.json();
      // const request = req.body as CreateTaskRequest;
      request.createdAt = new Date();
      request.updatedAt = new Date();
      request.completed = false;
      request.time = new Date(request.time);
      request.userId = session.user.id;
      console.log(request);
      const result = await db.insert(tasks).values(request).returning();
      console.log(result);
      return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error }, { status: 500 });
    }
  }
  if (req.method === "GET") {
    try {
      const result = await db.select().from(tasks).where(
        // @ts-ignore
        eq(tasks.userId, session.user.id)
      );
      console.log(result);
      return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error }, { status: 500 });
    }
  }
}

export const POST = handlers;
