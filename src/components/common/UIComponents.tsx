import type { ReactNode } from "react";

function cn(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface CardProps {
  children: ReactNode;
  className?: string;
  accentColor?: string;
}

export function Card({ children, className = "" }: CardProps) {
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

export function Grid({
  children,
  columns = 2,
  className = "",
}: {
  children: ReactNode;
  columns?: 2 | 3;
  className?: string;
}) {
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

export function Tag({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
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

export function TagList({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-auto flex flex-wrap gap-2 pt-8", className)}>
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
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
