import Image from "next/image";
import logo from "../../../public/timeblocker.png";

export default function LoginLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav className="w-full flex justify-between p-4 mr-24">
        <Image src={logo} className="h-12 w-auto" alt="logo" />
      </nav>

      {children}
    </section>
  );
}
