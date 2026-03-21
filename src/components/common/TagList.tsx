import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface TagListProps {
  children: ReactNode;
  className?: string;
}

export default function TagList({ children, className = "" }: TagListProps) {
  return (
    <div className={cn("mt-auto flex flex-wrap gap-2 pt-8", className)}>
      {children}
    </div>
  );
}
