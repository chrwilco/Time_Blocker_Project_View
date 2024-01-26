import Image from "next/image";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // If a user is not logged in.
  if (!session) {
    redirect("/login");
  }
  redirect("/dashboard");
}
