// "use client";
import React from "react";
import * as z from "zod";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { auth } from "../auth";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

async function ManagePage() {
  const session = await auth();
  console.log(session);
  return (
    <div className="w-screen h-screen flex flex-col gap-4 p-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Manage</h1>
        <p className="text-lg">Manage your Tasks.</p>
      </div>
    </div>
  );
}

export default ManagePage;
