// "use client";
import React from "react";
import * as z from "zod";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import Handler from "./handler";
import { auth } from "../auth";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

async function LoginPage() {
  const session = await auth();
  console.log(session);
  return <Handler session={session} />;
}

export default LoginPage;
