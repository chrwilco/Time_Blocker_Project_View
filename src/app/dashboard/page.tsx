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
import Task from "@/components/ui/task";

async function DashboardPage() {
  const session = await auth();
  const tasks = await db.select().from(_tasks).where(
    // @ts-ignore
    eq(_tasks.userId, session.user.id)
  );

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
      <div className="flex flex-col gap-4 px-12 pt-6 pb-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-lg">Your Tasks at a glance.</p>
        </div>
      </div>
      <Card className="w-2/3 mx-auto">
        <CardHeader>
          Upcoming Tasks
          <CardDescription>{/* Add something here */}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row mx-auto flex-wrap gap-4">
          {tasks.map((task) => (
            <div key={task.name} className="w-2/3 mx-auto">
              <Task task={task} />
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

export default DashboardPage;
