import ShoutComposer from "@/components/shouts/ShoutComposer";
import ShoutItem from "@/components/shouts/ShoutItem";
import { mockShouts } from "@/const/shout";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl bg-white mt-4 rounded-md">
      <div className="border-b border-border pb-4">
        <ShoutComposer />
      </div>

      <div className="flex flex-col gap-4">
        {mockShouts.map((shout) => (
          <ShoutItem key={shout.key} shout={shout} />
        ))}
      </div>
    </div>
  );
}
