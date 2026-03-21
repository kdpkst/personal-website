import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface TagProps {
  children: ReactNode;
  className?: string;
}

export default function Tag({ children, className = "" }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-white/55 bg-white/58 px-3 py-1 text-[0.8rem] font-medium text-text-primary shadow-[0_10px_22px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md",
        className,
      )}
    >
      {children}
    </span>
  );
}
