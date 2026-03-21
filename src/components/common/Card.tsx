import type { ReactNode } from "react";
import { cn } from "./cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  accentColor?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={cn(
        "liquid-glass flex h-full flex-col overflow-hidden rounded-[28px] border border-white/50 bg-white/55 p-8 shadow-[0_18px_48px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-2xl transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-0.5 hover:border-white/65 hover:bg-white/62 hover:shadow-[0_24px_64px_rgba(15,23,42,0.11),inset_0_1px_0_rgba(255,255,255,0.9)] md:p-10 xl:p-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
