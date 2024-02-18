// "use client";
import React from "react";
import * as z from "zod";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { auth } from "../../auth";
import {
  tasks as _tasks,
  categories,
  categoriesToTasks,
  db,
} from "../../lib/drizzle";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import Task from "@/components/ui/task";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

async function ManagePage() {
  const session = await auth();
  // const tasks = await db.select().from(_tasks).where(
  //   // @ts-ignore
  //   eq(_tasks.userId, session.user.id)
  // );

  let tasks: any;
  try {
    const tasksQuery = db
      .select()
      .from(_tasks)
      .innerJoin(categoriesToTasks, eq(categoriesToTasks.taskId, _tasks.id))
      .innerJoin(categories, eq(categoriesToTasks.categoryId, categories.id))
      .where(
        // @ts-ignore
        eq(_tasks.userId, session.user.id)
      );
    // .groupBy(_tasks.id);
    tasks = await tasksQuery;

    // await tasks.forEach(async (task: any, index: number) => {
    //   const categoriesQuery = db
    //     .select()
    //     .from(categoriesToTasks)
    //     .leftJoin(categories, eq(categoriesToTasks.categoryId, categories.id))
    //     .where(
    //       // @ts-ignore
    //       eq(categoriesToTasks.taskId, task.id)
    //     );
    //   const taskcategories: any = await categoriesQuery;
    //   tasks[index].categories = taskcategories;
    //   console.log(taskcategories);
    // });
  } catch (e) {
    console.log(e);
  }

  if (tasks) {
    return (
      <div className="w-screen h-screen flex flex-col gap-4 p-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Manage</h1>
          <p className="text-lg">Manage your Tasks.</p>
        </div>
        <Card className="w-3/4 mx-auto">
          <CardContent className="flex flex-wrap gap-4 justify-center p-4 ">
            <Accordion type="single" collapsible className="w-3/4">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex flex-col items-start">
                    Show All
                    <div className="text-stone-400 text-xs">
                      ({tasks.length})
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 w-full">
                  {tasks.map((task: any) => {
                    return <Task task={task.tasks} key={task.id} />;
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        <Card className="w-3/4 mx-auto">
          <CardContent className="flex flex-wrap gap-4 justify-center p-4 ">
            <Accordion type="single" collapsible className="w-3/4">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex flex-col items-start">
                    Upcoming
                    <div className="text-stone-400 text-xs">
                      ({tasks.length})
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 w-full">
                  {tasks.map((task: any) => (
                    <Task task={task} key={task.id} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        <Card className="w-3/4 mx-auto">
          <CardContent className="flex flex-wrap gap-4 justify-center p-4 ">
            <Accordion type="single" collapsible className="w-3/4">
              <AccordionItem value="item-1 ">
                <AccordionTrigger>
                  <div className="flex flex-col items-start">
                    Adjust Priority
                    <div className="text-stone-400 text-xs">
                      ({tasks.length})
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 w-full ">
                  {/* Turn into dragable items to adjust order */}
                  {tasks.map((task: any) => (
                    <Task task={task} key={task.id} />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default ManagePage;
