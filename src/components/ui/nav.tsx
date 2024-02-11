"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import logo from "../../../public/timeblocker.png";
import DarkModeToggle from "@/components/ui/dark-mode-button";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Nav() {
  return (
    <section>
      <nav className="w-full flex justify-between p-4 mr-24">
        <Link href="/">
          <Image src={logo} className="h-12 w-auto" alt="logo" />
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col">
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/dashboard"
                      >
                        {/* <Icons.logo className="h-6 w-6" /> */}
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Dashboard
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Add Breif glance of tasks.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/create" title="Create task">
                    Create a daily, weekly, or monthly task.
                  </ListItem>
                  {/* <ListItem href="/docs/installation" title="Installation">
                    How to install dependencies and structure your app.
                  </ListItem> */}
                  <ListItem href="/manage" title="Manage tasks">
                    Manage your tasks.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Settings</NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col">
                <ul className="grid w-[300px] gap-3 p-4 md:w-[400px]  lg:w-[500px]">
                  <ListItem href="/profile" title="Profile">
                    View and edit your profile.
                  </ListItem>
                  <ListItem>
                    <DarkModeToggle />
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="blank"></div>
      </nav>
    </section>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  );
});
ListItem.displayName = "ListItem";
