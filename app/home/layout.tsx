import logo from "@/assets/images/permishout-logo-full.svg";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="p-4 bg-white">
        <nav className="flex gap-8 items-center container mx-auto">
          <Link href="/home">
            <Image src={logo} alt="Permishout" width={200} height={50} />
          </Link>

          <div className="ml-auto">
            <UserButton />
          </div>
        </nav>
      </header>
      <main className="container mx-auto">{children}</main>
    </>
  );
}
