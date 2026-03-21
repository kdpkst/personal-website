import type { ReactNode } from "react";
import { cn } from "./cn";

interface GridProps {
  children: ReactNode;
  columns?: 2 | 3;
  className?: string;
}

export default function Grid({
  children,
  columns = 2,
  className = "",
}: GridProps) {
  return (
    <div
      className={cn(
        "grid",
        columns === 2
          ? "grid-cols-1 gap-6 lg:grid-cols-2 xl:gap-8"
          : "grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
