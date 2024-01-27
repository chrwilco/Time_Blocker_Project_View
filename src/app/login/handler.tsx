"use client";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { auth } from "../auth";

function Handler({ session }: { session: any }) {
  console.log(session);
  if (session?.user) {
    redirect("/dashboard");
  } else {
    signIn();
  }
  return <></>;
}

export default Handler;
