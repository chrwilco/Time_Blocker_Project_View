import Nav from "@/components/ui/nav";
import React from "react";

function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
}

export default ProfileLayout;
