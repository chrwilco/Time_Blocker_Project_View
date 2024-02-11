"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Checkbox } from "./checkbox";
import { db } from "@/app/lib/drizzle";
import { tasks as _task } from "@/app/lib/drizzle";
import { Card, CardContent, CardDescription, CardHeader } from "./card";

function Task({ task }: { task: any }) {
  const toggleComplete = () => {
    try {
      db.update(_task).set({ completed: !task.completed }).where(task.id);
      console.log("Task Updated");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <div className="w-full">
          <Card>
            <CardHeader>
              {task.name}
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </PopoverTrigger>
      <PopoverContent className="lg:w-96 lg:h-72">
        {/* <div className="flex justify-between">
          <h1 className="text-2xl font-bold capitalize">{task.name}</h1>
          <div className="flex gap-2 items-center">
            <Checkbox onClick={() => toggleComplete} />
            <label htmlFor="Completed">Completed</label>
          </div>
        </div> */}
        <Card>
          <CardHeader>
            {task.name}
            <CardDescription>{task.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="flex gap-2 items-center">
                <Checkbox onClick={() => toggleComplete} />
                <label htmlFor="Completed">Completed</label>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export default Task;
