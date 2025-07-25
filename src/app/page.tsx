import { DarkModeToggle } from "@/components/common/darkmode-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-muted flex justify-center items-center h-screen flex-col space-y-4">
      <h1 className="text-4xl font-semibold">Welcome Murtaki Shihab</h1>
      <Link href={'/dashboard'}>
        <Button className="cursor-pointer bg-teal-700   font-semibold"> Go to Dashboard</Button>
      </Link>
    </div>
  );
}
