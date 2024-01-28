"use client";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { db, tasks } from "../lib/drizzle";

const CreateFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  description: z.string(),
  time: z.date().min(new Date(), { message: "Time must be in the future" }),
});

function CreatePage() {
  const createForm = useForm<z.infer<typeof CreateFormSchema>>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      time: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof CreateFormSchema>) {
    // console.log(values);
    // CreateTask(values);
    // console.log(values);
    // try {
    //   await db.insert(tasks).values(values).onConflictDoNothing();
    // } catch (error) {
    //   console.log(error);
    // }
    fetch("/api/create-task", {
      method: "POST",
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((err) => {
            throw err;
          });
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const [date, setDate] = useState<Date | undefined>(undefined);
  useEffect(() => {
    if (date) {
      createForm.setValue("time", date);
    }
  }, [date]);

  return (
    <>
      <div className="flex flex-col gap-4 px-12 pt-6 pb-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Create Tasks</h1>
          <p className="text-lg">Create a new task.</p>
        </div>
      </div>
      <Card className="w-2/3 mx-auto">
        <CardHeader>
          Create Task
          <CardDescription>
            Create a daily, weekly, or monthly task.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...createForm}>
            <form
              onSubmit={createForm.handleSubmit(onSubmit)}
              className="gap-4 flex flex-col"
            >
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            {...field}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <Button variant="outline" type="submit">
                Create
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export default CreatePage;
