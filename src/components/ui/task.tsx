import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Checkbox } from "./checkbox";
import { db } from "@/app/lib/drizzle";
import { tasks as _task } from "@/app/lib/drizzle";

function Task({ task }: { task: any }) {
  const toggleComplete = () => {
    db.update(_task).set({ completed: !task.completed }).where(task.id);
  };

  return (
    <Popover>
      <PopoverTrigger>
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
      </PopoverTrigger>
      <PopoverContent className="w-96 h-72">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold capitalize">{task.name}</h1>
          <div className="flex gap-2 items-center">
            <Checkbox onClick={toggleComplete()} />
            <label htmlFor="Completed">Completed</label>
          </div>
        </div>
        <p className="text-lg">{task.description}</p>
      </PopoverContent>
    </Popover>
  );
}

export default Task;
