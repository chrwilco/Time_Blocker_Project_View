import React from "react";
import { auth } from "../auth";
import { redirect } from "next/navigation";
import Profile from "./profile";

type User = {
  name: string;
  email: string;
  image: string;
};

async function ProfilePage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  const user: User = session.user;
  return <Profile user={user} />;
}

export default ProfilePage;
