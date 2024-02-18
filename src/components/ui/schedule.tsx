import React from "react";

/**
 * v0 by Vercel.
 * @see https://v0.dev/t/LYGBe5iJ6Ry
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import Task from "./task";
import { after } from "node:test";

export default function Schedule(tasks: any) {
  const today = new Date();
  const time = today.getHours();
  const schedule = [];
  const todayTasks = tasks.tasks.filter((task: any) => {
    const taskDate = new Date(task.time);
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });
  for (let i = time - 1; i < 24; i++) {
    const tasks = todayTasks.filter((task: any) => {
      const taskDate = new Date(task.time);
      return taskDate.getHours() === i;
    });
    let tasksComponent;
    if (tasks.length >= 1) {
      tasksComponent = tasks.map((task: any) => {
        return i === time - 1 ? (
          <div className="mt-2 w-full">
            <Task key={task.id} task={task} variant="previous" />
            <div className="border-2 border-dotted border-b-stone-400 w-full mt-6"></div>
          </div>
        ) : i === time ? (
          <div className="mt-2 w-full">
            <Task key={task.id} task={task} variant="current" />
            <div className="border-2 border-dotted border-b-stone-400 w-full mt-6"></div>
          </div>
        ) : (
          <Task key={task.id} task={task} />
        );
      });
    }

    let afternoon = false;
    if (i > 12) {
      afternoon = true;
    }
    if (i === time - 1) {
      schedule.push(
        <div
          className="flex flex-col items-start text-red-500/80 mt-12"
          key={i}
        >
          <h2 className="text-xl mb-4 font-bold">Last Hour</h2>

          <div className="flex items-center space-x-4">
            <ClockIcon className="h-6 w-6 opacity-50" />
            <h2 className="font-semibold text-lg text-red-500/80">
              {afternoon
                ? `${i - 12}:00 PM - ${i + 1 - 12}:00 PM`
                : `${i}:00 AM - ${i + 1}:00 AM`}
            </h2>
          </div>
          {tasksComponent}
        </div>
      );
    } else if (i === time) {
      schedule.push(
        <>
          <div className="flex flex-col items-start text-green-500/80" key={i}>
            <h2 className="text-xl mb-4 font-bold">Now</h2>
            <div className="flex items-center space-x-4">
              <ClockIcon className="h-6 w-6 opacity-50" />
              <h2 className="font-semibold text-lg text-green-500/80">
                {afternoon
                  ? `${i - 12}:00 PM - ${i + 1 - 12}:00 PM`
                  : `${i}:00 AM - ${i + 1}:00 AM`}
              </h2>
            </div>
            {tasksComponent}
          </div>
          <h2 className="text-xl mb-4 text-stone-500 font-bold">Future</h2>
        </>
      );
    } else if (i > 12) {
      schedule.push(
        <div className="flex flex-col items-start text-stone-500/80" key={i}>
          <div className="flex items-center space-x-4">
            <ClockIcon className="h-6 w-6 opacity-50" />
            <h2 className="font-semibold text-lg">
              {i - 12}:00 PM - {i + 1 - 12}:00 PM
            </h2>
          </div>
          {tasksComponent}
        </div>
      );
    } else {
      schedule.push(
        <div className="flex flex-col items-start text-stone-500/80" key={i}>
          <div className="flex items-center space-x-4">
            <ClockIcon className="h-6 w-6 opacity-50" />
            <h2 className="font-semibold text-lg">
              {i}:00 AM - {i + 1}:00 AM
            </h2>
          </div>
          {tasksComponent}
        </div>
      );
    }
  }

  return (
    <>
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl">Today's Schedule</CardTitle>
        <CardDescription>
          Add your tasks and appointments for the day
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* <div className="flex items-center space-x-4">
          <ClockIcon className="h-6 w-6 opacity-50" />
          <h2 className="font-semibold text-lg">9:00 AM - 10:00 AM</h2>
        </div>
        <div className="grid gap-2 mx-10">
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <p>Task 1</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <p>Task 2</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ClockIcon className="h-6 w-6 opacity-50" />
          <h2 className="font-semibold text-lg">10:00 AM - 11:00 AM</h2>
        </div>
        <div className="grid gap-2 mx-10">
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <p>Meeting with Team A</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <p>Review Project Plan</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ClockIcon className="h-6 w-6 opacity-50" />
          <h2 className="font-semibold text-lg">11:00 AM - 12:00 PM</h2>
        </div>
        <div className="grid gap-2 mx-10">
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <p>Client Call</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckIcon className="h-4 w-4 text-green-500" />
            <p>Prepare Presentation</p>
          </div>
        </div> */}
        {schedule}
      </CardContent>
    </>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
