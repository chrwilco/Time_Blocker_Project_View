import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "../auth";
async function Profile({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string;
  };
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Card className="w-2/3">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between">
              <div className="">Profile</div>
            </div>
          </CardTitle>
          <CardDescription>
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-4 items-center">
                {user.name}
                <Avatar>
                  <AvatarImage src={user.image} />
                  <AvatarFallback>{user.name?.slice(0, 1)}</AvatarFallback>
                </Avatar>
              </div>
              <Button size="sm">Sign out</Button>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="w-2/3">
        <CardHeader>
          <CardTitle>User Settings </CardTitle>
          <CardDescription>Adjust your Profile</CardDescription>
        </CardHeader>
        <CardContent>Form Here</CardContent>
      </Card>
    </div>
  );
}

export default Profile;
