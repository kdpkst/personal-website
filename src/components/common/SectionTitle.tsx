import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

export default function SectionTitle({
  children,
  className = "",
}: SectionTitleProps) {
  return (
    <h2
      className={cn(
        "mb-12 text-[2.2rem] font-bold tracking-[-0.02em] text-text-primary",
        className,
      )}
    >
      {children}
    </h2>
  );
}
