"use client";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Checkbox } from "./checkbox";
import { db } from "@/app/lib/drizzle";
import { tasks as _task } from "@/app/lib/drizzle";
import { Card, CardContent, CardDescription, CardHeader } from "./card";
import { Edit, Save, X } from "lucide-react";
import { Close } from "@radix-ui/react-popover";
import { Button } from "./button";
import { Badge } from "./badge";

function Task({
  task,
  variant,
  categories,
}: {
  task: any;
  variant?: string;
  categories?: any;
}) {
  task.name =
    String(task.name).charAt(0).toUpperCase() + String(task.name).slice(1);
  const [isEditing, setIsEditing] = useState(false);
  const toggleComplete = () => {
    try {
      db.update(_task).set({ completed: !task.completed }).where(task.id);
      console.log("Task Updated");
    } catch (e) {
      console.error(e);
    }
  };
  const variantTextClass = (variant?: string) => {
    switch (variant) {
      case "previous":
        return "text-red-600 dark:text-red-500";
      case "current":
        return "text-green-600 dark:text-green-500";
      default:
        return "text-stone-900 dark:text-stone-100";
    }
  };

  const variantBorderClass = (variant?: string) => {
    switch (variant) {
      case "previous":
        return "border-red-500/50";
      case "current":
        return "border-green-500/50";
      default:
        return "border-stone-300 dark:border-stone-700";
    }
  };

  const titleRef = React.useRef(null);
  useEffect(() => {
    if (isEditing) {
      // @ts-ignore
      titleRef?.current?.focus();
    }
  }, [isEditing]);

  const deleteTask = () => {
    try {
      fetch("/api/task", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: task.id }),
      });
    } catch (e) {
      console.error(e);
    }
  };
  console.log(task);
  return isEditing ? (
    <Popover>
      <PopoverTrigger className="w-full">
        <div className="w-full">
          <Card className={variantBorderClass(variant)}>
            <CardHeader className={"flex items-start text-left"}>
              <div className={variantTextClass(variant)}>{task.name}</div>
              <CardDescription className="flex text-left">
                <div className={variantTextClass(variant)}>
                  {task.description}
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </PopoverTrigger>
      <PopoverContent className={"p-0 m-0 "}>
        <Card className={variantBorderClass(variant)}>
          <CardHeader>
            <div className={"flex justify-between " + variantTextClass}>
              <div className={variantTextClass(variant)}>
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) => {
                    task.name = e.target.value;
                  }}
                  ref={titleRef}
                />
              </div>
              <Save
                className="hover:text-stone-400 hover:dark:text-stone-500"
                onClick={() => setIsEditing(!isEditing)}
              />
              <Close
                className="hover:text-stone-400 hover:dark:text-stone-500"
                onClick={() => setIsEditing(!isEditing)}
              >
                <X />
              </Close>
            </div>
            <CardDescription>
              <textarea
                value={task.description}
                onChange={(e) => {
                  task.description = e.target.value;
                }}
                className="w-full h-full"
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="flex gap-2 justify-start w-full">
                {/* <Checkbox onClick={() => toggleComplete} /> */}
                {/* <label htmlFor="Completed">Completed</label> */}
                <Button variant="destructive" onClick={deleteTask}>
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  ) : (
    <Popover>
      <PopoverTrigger className="w-full">
        <div className="w-full">
          <Card className={variantBorderClass(variant)}>
            <CardHeader className={"flex items-start text-left"}>
              <div className={variantTextClass(variant)}>{task.name}</div>
              <CardDescription className="flex text-left">
                <div className={variantTextClass(variant)}>
                  {task.description}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories && categories?.length > 0 && (
                <div className="flex gap-2 bg-blue-400 w-full h-24">
                  {categories.map((category: any, index: any) => (
                    <Badge
                      id={category.name + index}
                      // @ts-ignore
                      variant={category.color}
                      className="cursor-pointer"
                      key={category.name + index}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 m-0">
        <Card>
          <CardHeader>
            <div className={"flex justify-between " + variantTextClass}>
              <div className={variantTextClass(variant) + " text-2xl"}>
                {task.name}
              </div>
              <Edit
                className="hover:text-stone-400 hover:dark:text-stone-500"
                onClick={() => setIsEditing(!isEditing)}
              />
            </div>
            <CardDescription className={variantTextClass(variant) + " text-lg"}>
              {task.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="flex gap-2 items-center">
                <Checkbox onClick={() => toggleComplete} />
                <label htmlFor="Completed">Completed</label>
              </div>
              <div>
                {task.duration && (
                  <div className="flex flex-col gap-2 items-center">
                    <div className="text-stone-400">Duration:</div>
                    <div className="text-stone-900 dark:text-stone-100">
                      {task.duration > 1
                        ? task.duration + " minutes"
                        : "1 minute"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export default Task;
