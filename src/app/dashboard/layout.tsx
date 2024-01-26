"use client";

import Nav from "@/components/ui/nav";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Nav />
      {children}
    </section>
  );
}
