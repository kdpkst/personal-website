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
        "flex h-full flex-col rounded-card bg-bg-secondary p-8 md:p-10 xl:p-12 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-[1.02] hover:shadow-card",
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
        "inline-block rounded-full bg-bg-tertiary px-3 py-1 text-[0.8rem] font-medium text-text-primary",
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
