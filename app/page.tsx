import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import logo from "@/assets/images/permishout-logo-full-vertical.svg";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white grow">
      <div className="mx-auto container flex flex-col justify-center items-center h-screen p-4">
        <Link href="/profile/create">
          <Image src={logo} alt="PermiShout Logo" width={400} height={400} />
        </Link>

        <h1 className="text-3xl font-bold text-center mb-2 mt-10">
          Welcome to Permi<span className="text-[#FF9747]">S</span>hout
        </h1>
        <p className="text-lg text-center mb-8">
          Shout only when you’re allowed.
        </p>
        <Link href="/profile/create" className={buttonVariants({ size: "lg" })}>
          Get Started
        </Link>
      </div>
    </div>
  );
}
