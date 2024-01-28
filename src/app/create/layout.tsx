import Nav from "@/components/ui/nav";
import React from "react";

function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Nav />
      {children}
    </div>
  );
}

export default CreateLayout;
