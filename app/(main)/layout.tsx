import logo from "@/assets/images/permishout-logo-full.svg";
import FooterNavBar from "@/components/FooterNavBar";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <header className="p-4 bg-white">
        <nav className="flex gap-8 items-center container mx-auto max-w-2xl">
          <Link href="/home">
            <Image src={logo} alt="Permishout" width={200} height={50} />
          </Link>

          <div className="ml-auto">
            <UserButton />
          </div>
        </nav>
      </header>
      <main className="container mx-auto flex-1 overflow-y-auto max-w-2xl mt-4">
        {children}
      </main>
      <FooterNavBar />
    </div>
  );
}
