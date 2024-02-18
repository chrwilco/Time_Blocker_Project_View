"use client";
import React, { useEffect, useRef, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
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
import { format, set } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { db, tasks } from "../../lib/drizzle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories as _categories } from "../../lib/drizzle";
import { redirect } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-select";

const CreateFormSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  description: z.string(),
  time: z.date().min(new Date(), { message: "Time must be in the future" }),
  categories: z.array(z.number()),
  duration: z.number(), // Labeled on webpage as estimated time required
});

function CreatePage() {
  const cal = useRef(null);
  const createForm = useForm<z.infer<typeof CreateFormSchema>>({
    resolver: zodResolver(CreateFormSchema),
    defaultValues: {
      name: "",
      description: "",
      time: undefined,
      duration: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof CreateFormSchema>) {
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
        toast.success("Task Created");
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

  const toggleSelected = (value: string) => {
    switch (value) {
      case "a":
        setDate(new Date());
        break;
      case "b":
        setDate(new Date(Date.now() + 86400000));
        break;
      case "c":
        setDate(new Date(Date.now() + 604800000));
        break;
      case "d":
        setDate(new Date(Date.now() + 2592000000));
        break;
    }
  };

  const [categories, setCategories] = useState([
    {
      name: "Work",
      color: "red",
      selected: false,
    },
    {
      name: "Personal",
      color: "blue",
      selected: true,
    },
    {
      name: "School",
      color: "green",
      selected: false,
    },
    {
      name: "Health",
      color: "yellow",
      selected: false,
    },
    {
      name: "Fitness",
      color: "orange",
      selected: true,
    },
    {
      name: "Hobbies",
      color: "purple",
      selected: true,
    },
  ]);
  useEffect(() => {
    const selectedCategories = categories.filter((c) => c.selected);
    if (selectedCategories.length) {
      createForm.setValue(
        "categories",
        selectedCategories.map((c: any) => c.id)
      );
    }
  }, [categories]);

  useEffect(() => {
    fetch("/api/category", {
      method: "GET",
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
        if (data.tasks.length) {
          setCategories(
            data.tasks.map((category: any) => ({
              ...category,
              selected: false,
            }))
          );
        }
      });
  }, []);

  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "",
    selected: true,
  });

  const updateCategory = (id: number) => {
    setCategories((prev) => {
      const newCategories = prev.map((category, index) => {
        if (index === id) {
          return {
            ...category,
            selected: !category.selected,
          };
        }
        return category;
      });
      return newCategories;
    });
  };

  const updateNewCategory = (key: string, e: string) => {
    setNewCategory((prev) => {
      return {
        ...prev,
        [key]: e ? e : "",
      };
    });
  };

  const createNewCategory = () => {
    // Add request to add to category to db
    fetch("/api/category", {
      method: "POST",
      body: JSON.stringify(newCategory),
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
        redirect("/dashboard");
      })
      .catch((err) => {
        console.log(err);
      });

    setCategories((prev) => {
      return [...prev, newCategory];
    });
    setNewCategory({} as any);
  };

  const [showCustomeDuration, setShowCustomDuration] = useState<boolean>(false);
  const [customDuration, setCustomDuration] = useState<number>(0);
  const selectChanged = () => {
    if (createForm.watch("duration").valueOf() <= -0.1) {
      setShowCustomDuration(true);
    } else {
      setShowCustomDuration(false);
    }
  };
  const [customDurationMeasure, setCustomDurationMeasure] =
    useState<string>("minutes");

  useEffect(() => {
    if (customDuration && createForm.watch("duration").valueOf() < 0) {
      const durationMeasure = customDurationMeasure === "minutes" ? 1 : 60;
      createForm.setValue("duration", customDuration * durationMeasure);
    }
  }, [customDuration, customDurationMeasure]);

  return (
    <>
      <TooltipProvider>
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
                      <FormLabel>Complete Before</FormLabel>
                      <FormControl>
                        <>
                          <ToggleGroup
                            type="single"
                            className="flex flex-col md:flex-row items-start md:items-center"
                          >
                            <ToggleGroupItem
                              value="a"
                              onClick={() => setDate(new Date())}
                            >
                              Today
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="b"
                              onClick={() =>
                                setDate(new Date(Date.now() + 86400000))
                              }
                            >
                              Tomorrow
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="c"
                              onClick={() =>
                                setDate(new Date(Date.now() + 604800000))
                              }
                            >
                              This Week
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="d"
                              onClick={() =>
                                setDate(new Date(Date.now() + 2592000000))
                              }
                            >
                              This Month
                            </ToggleGroupItem>
                          </ToggleGroup>

                          <div className="flex justify-center">
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
                                  fromDate={new Date()}
                                  toDate={new Date(Date.now() + 31536000000)}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Time Required</FormLabel>
                      <FormControl>
                        <>
                          <Select
                            onValueChange={(e) => {
                              field.onChange(parseInt(e));
                              selectChanged();
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 minutes</SelectItem>
                              <SelectItem value="10">10 minutes</SelectItem>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="120">2 hours</SelectItem>
                              <SelectItem value="180">3 hours</SelectItem>
                              <SelectItem value="240">4 hours</SelectItem>
                              <SelectItem value="300">5 hours</SelectItem>
                              <SelectItem value="360">6 hours</SelectItem>
                              <SelectItem value="420">7 hours</SelectItem>
                              <SelectItem value="480">8 hours</SelectItem>
                              {/* <SelectItem value="-1">Custom</SelectItem>  FINISH LATER */}
                            </SelectContent>
                          </Select>
                          {showCustomeDuration && (
                            <>
                              {/* <Label>Custom Duration</Label> */}
                              <div className="flex gap-4">
                                <Input
                                  placeholder="Custom Duration"
                                  onChange={(e) =>
                                    setCustomDuration(
                                      parseInt(e.target.value, 10)
                                    )
                                  }
                                  type="number"
                                  min={0}
                                  max={
                                    customDurationMeasure === "minutes"
                                      ? 60
                                      : 24
                                  }
                                  step={1}
                                />
                                <Select
                                  onValueChange={setCustomDurationMeasure}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Unit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="minutes">
                                      Minutes
                                    </SelectItem>
                                    <SelectItem value="hours">Hours</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          )}
                        </>
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
                      <FormLabel className="flex gap-4 items-center">
                        Categories
                        <FormDescription className="text-stone-400">
                          ({categories.filter((c) => c.selected).length})
                        </FormDescription>
                      </FormLabel>
                      <FormDescription className="text-stone-400 hover:text-stone-800 hover:dark:text-stone-300 text-xs cursor-pointer">
                        <Link href="/manage-categories">Manage Categories</Link>
                      </FormDescription>
                      <FormControl>
                        <div className="flex flex-wrap gap-4 justify-center">
                          {categories.map((category, index) => (
                            <Badge
                              id={category.name + index}
                              // @ts-ignore
                              variant={
                                category.selected ? category.color : "outline"
                              }
                              onClick={() => updateCategory(index)}
                              className="cursor-pointer"
                              key={category.name + index}
                            >
                              {category.name}
                            </Badge>
                          ))}
                          <div className="w-full flex justify-center">
                            <Drawer>
                              <DrawerTrigger>
                                <Badge className="cursor-pointer">+</Badge>
                              </DrawerTrigger>
                              <DrawerContent>
                                <DrawerHeader>
                                  <h1 className="text-2xl font-bold">
                                    Add New Category
                                  </h1>
                                </DrawerHeader>
                                <div className="w-3/4 mx-auto gap-4 flex flex-col">
                                  <Input
                                    placeholder="Category Name"
                                    onChange={(e) =>
                                      updateNewCategory("name", e.target.value)
                                    }
                                  />
                                  <Select
                                    onValueChange={(e) =>
                                      updateNewCategory("color", e)
                                    }
                                    {...field}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="red">Red</SelectItem>
                                      <SelectItem value="blue">Blue</SelectItem>
                                      <SelectItem value="green">
                                        Green
                                      </SelectItem>
                                      <SelectItem value="yellow">
                                        Yellow
                                      </SelectItem>
                                      <SelectItem value="orange">
                                        Orange
                                      </SelectItem>
                                      <SelectItem value="purple">
                                        Purple
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <DrawerFooter>
                                  <DrawerClose>
                                    <Button
                                      variant="outline"
                                      onClick={() => createNewCategory()}
                                    >
                                      Create
                                    </Button>
                                  </DrawerClose>
                                </DrawerFooter>
                              </DrawerContent>
                            </Drawer>
                          </div>
                        </div>
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
      </TooltipProvider>
    </>
  );
}

export default CreatePage;
