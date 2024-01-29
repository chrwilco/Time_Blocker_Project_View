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
import { eq } from "drizzle-orm";
import Scheduler from "./scheduler";

async function DashboardPage() {
  const session = await auth();
  const tasks = await db.select().from(_tasks).where(
    // @ts-ignore
    eq(_tasks.userId, session.user.id)
  );
  console.log(tasks);

  return (
    <>
      {/* <Button color="primary">Click Me</Button> */}

      {/* Show View of today's timeline */}
      {/* Maybe with this
      https://www.npmjs.com/package/@syncfusion/ej2-react-schedule
      */}

      {/* Show View of today's tasks */}
      {/* Maybe with this */}
      <div className="flex flex-col gap-4 px-12 pt-6 pb-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-lg">Your Tasks at a glance.</p>
        </div>
      </div>

      <Card className="w-2/3 mx-auto overflow-hidden">
        <Scheduler />
      </Card>

      <Card className="w-2/3 mx-auto mt-4">
        <CardHeader>
          Upcoming Tasks
          <CardDescription>{/* Add something here */}</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.map((task) => (
            <div
              className="flex flex-col border-stone-400 border-2 rounded-lg p-4 m-4"
              key={task.id}
            >
              <div className="flex justify-between w-full items-center">
                <div className="text-xl font-bold">{task.name}</div>
                <div className="text-xs ">
                  {new Date(task.time).toLocaleTimeString()}
                </div>
              </div>
              <div className="text-md font-bold">{task.description}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

export default DashboardPage;
