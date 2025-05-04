import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import logo from "@/assets/images/permishout-logo-full-vertical.svg";
import Image from "next/image";

import permitiologo from "@/assets/images/permitio.svg";

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

        <div className="flex items-center justify-center gap-2 mt-2">
          <div>Powered by</div>
          <a href="https://www.permit.io/" target="_blank">
            <Image
              src={permitiologo}
              alt="Permit.io Logo"
              width={75}
              height={75}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
