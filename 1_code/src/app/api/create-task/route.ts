import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { categoriesToTasks, db, tasks } from "@/app/lib/drizzle";
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
  if (req.method === "POST") {
    try {
      const request = await req.json();
      // const request = req.body as CreateTaskRequest;
      request.createdAt = new Date();
      request.updatedAt = new Date();
      request.completed = false;
      request.time = new Date(request.time);
      request.userId = session.user.id;
      const result = await db
        .insert(tasks)
        .values({
          name: request.name,
          description: request.description,
          completed: request.completed,
          time: request.time,
          duration: request.duration,
          userId: request.userId,
          createdAt: request.createdAt,
          updatedAt: request.updatedAt,
        })
        .returning();
      try {
        request.categories.map(async (c: any) => {
          let payload = {
            createdAt: new Date(),
            updatedAt: new Date(),
            taskId: result[0].id,
            categoryId: c,
          };
          const category = await db
            .insert(categoriesToTasks)
            .values(payload)
            .returning();
        });
      } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
      return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
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
}

export const POST = handlers;
