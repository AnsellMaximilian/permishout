import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="font-bold text-2xl">PermiShout!</h1>

        <Link href="/home" className={buttonVariants()}>
          Get Started
        </Link>
      </div>
    </div>
  );
}
