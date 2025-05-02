import { LucideProps } from "lucide-react";
import React from "react";

export default function IconText({
  icon: Icon,
  text,
}: {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  text: string;
}) {
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Icon size={16} />
      <div>{text}</div>
    </div>
  );
}
