"use client";
import React, { useEffect } from "react";
import * as z from "zod";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { auth } from "../auth";
import { tasks as _tasks, db } from "../lib/drizzle";
import { eq } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useState } from "react";
import Task from "@/components/ui/task";
import { Edit, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

function ManageCategoriesPage() {
  const [categories, setCategories] = useState(
    [] as {
      name: string;
      color: string;
      loading: boolean;
      id: string;
    }[]
  );
  const [editCategory, setEditCategory] = useState({
    name: "",
    color: "",
    id: "",
  });

  const updateNewCategory = (key: string, value: string) => {
    setEditCategory({ ...editCategory, [key]: value });
  };

  const updateEditCategory = () => {
    categories.map((c: any) => {
      if (c.id === editCategory.id) {
        c.loading = true;
      }
    });
    fetch(`/api/category`, {
      method: "PATCH",
      body: JSON.stringify(editCategory),
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
      .then(() => {
        const updatedCategory = {
          ...editCategory,
          loading: false,
        };
        setCategories([
          ...categories.filter((c) => c.id != editCategory.id),
          updatedCategory,
        ]);
      });
  };

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
              loading: false,
            }))
          );
        }
      });
  }, []);

  const deleteCategory = () => {
    fetch(`/api/category`, {
      method: "DELETE",
      body: JSON.stringify(editCategory),
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
      .then((data) => {});

    setCategories(categories.filter((c) => c.id !== editCategory.id));
  };
  return (
    <div className="w-screen h-screen flex flex-col gap-4 p-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
      </div>
      <Card className="w-2/3 mx-auto">
        <CardContent className="flex flex-wrap gap-4 justify-center p-4 ">
          {categories.length &&
            categories.map(
              (category: {
                name: string;
                color: string;
                loading: boolean;
                id: string;
              }) => (
                <div
                  key={category.id + " " + category.name}
                  className="w-2/3 mx-auto"
                >
                  <Card className="relative">
                    <CardHeader>
                      <div className="flex justify-between flex-col md:flex-row">
                        {!category?.loading ? (
                          category.name
                        ) : (
                          <Skeleton className="h-[25px] w-[50px]" />
                        )}
                      </div>
                      <CardDescription className="flex justify-between">
                        {!category?.loading ? (
                          category.color
                        ) : (
                          <Skeleton className="h-[25px] w-[50px]" />
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Drawer>
                        <DrawerTrigger
                          onClick={() => setEditCategory({ ...category })}
                        >
                          <div className="text-xs text-blue-500 hover:text-blue-800 hover:underline cursor-pointer">
                            {!category?.loading ? (
                              "Edit"
                            ) : (
                              <Skeleton className="h-[25px] w-[50px]" />
                            )}
                          </div>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <h1 className="text-2xl font-bold">
                              Edit Category
                            </h1>
                          </DrawerHeader>
                          <div className="w-3/4 mx-auto gap-4 flex flex-col">
                            <Input
                              placeholder="Category Name"
                              onChange={(e) =>
                                updateNewCategory("name", e.target.value)
                              }
                              defaultValue={category.name}
                            />
                            <Select
                              onValueChange={(e) =>
                                updateNewCategory("color", e)
                              }
                              defaultValue={category.color}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="color" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="blue">Blue</SelectItem>
                                <SelectItem value="green">Green</SelectItem>
                                <SelectItem value="yellow">Yellow</SelectItem>
                                <SelectItem value="orange">Orange</SelectItem>
                                <SelectItem value="purple">Purple</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <DrawerFooter className="flex justify-between flex-row px-24">
                            <DrawerClose>
                              <Button
                                variant="destructive"
                                onClick={() => deleteCategory()}
                              >
                                Delete
                              </Button>
                            </DrawerClose>
                            <DrawerClose>
                              <Button
                                variant="outline"
                                onClick={() => updateEditCategory()}
                              >
                                Update
                              </Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </CardContent>
                  </Card>
                </div>
              )
            )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ManageCategoriesPage;
