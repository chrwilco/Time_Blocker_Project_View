import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { auth } from "../auth";
import { SessionProvider } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { db, tasks as _tasks } from "../lib/drizzle";
import { and, eq, gte, lte } from "drizzle-orm";
import Task from "@/components/ui/task";
import Link from "next/link";
import Schedule from "@/components/ui/schedule";

async function DashboardPage() {
  const session = await auth();
  let tasks: any;
  const today = new Date();
  today.setHours(new Date().getHours() - 1, 0, 0, 0);
  await db
    .select()
    .from(_tasks)
    .where(
      // @ts-ignore
      and(eq(_tasks.userId, session.user.id), gte(_tasks.time, today))
    )
    .then((res) => {
      tasks = res;
      const todayTasks = tasks.filter((task: any) => {
        const today = new Date();

        const dueDate = new Date(task.dueDate);
        return dueDate.getDate() === today.getDate();
      });
    });

  return (
    <>
      {/* <Button color="primary">Click Me</Button> */}

      {/* Show View of today's timeline */}
      {/* Maybe with this
      https://www.npmjs.com/package/@syncfusion/ej2-react-schedule
      */}

      {/* Show View of today's tasks */}
      {/* Maybe with this */}

      {/* NVM that library requires a subscription */}
      <div className="flex flex-col gap-4 px-12 pt-6 pb-12 ">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-2xl">Your Tasks at a glance.</p>
        </div>
      </div>
      <Card className="w-2/3 mx-auto flex flex-col p-4">
        <Schedule tasks={tasks} />
      </Card>
      <Card className="w-2/3 mx-auto mt-6">
        {tasks && tasks.length > 0 ? (
          <>
            <CardHeader>
              <h1 className="text-bold text-2xl">Upcoming Tasks</h1>
              <CardDescription>{/* Add something here */}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row mx-auto flex-wrap gap-4">
              {tasks.map((task) => (
                <div key={task.name + task.id} className="w-2/3 mx-auto">
                  <Task task={task} />
                </div>
              ))}
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              No Tasks
              <CardDescription>Start by creating a task</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row mx-auto flex-wrap gap-4">
              <Link href="/task/create">
                <Button color="primary">Create Task</Button>
              </Link>
            </CardContent>
          </>
        )}
      </Card>
    </>
  );
}

export default DashboardPage;
