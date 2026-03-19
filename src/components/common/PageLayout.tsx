import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accentColor?: string;
}

const navItems = [
  { label: "About", route: "/about", id: "nav-link-about" },
  { label: "Portfolio", route: "/portfolio", id: "nav-link-portfolio" },
  { label: "Blog", route: "/blog", id: "nav-link-blog" },
] as const;

export default function PageLayout({
  title,
  subtitle,
  children,
}: PageLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary text-text-primary">
      <nav className="glass sticky top-0 z-[100] flex h-[52px] items-center justify-between border-b border-black/5 bg-[rgba(255,255,255,0.72)] px-8">
        <button
          className="flex items-center gap-1 text-[0.9rem] font-normal text-text-primary transition-opacity duration-150 hover:opacity-70"
          onClick={() => navigate("/")}
          id="back-to-maze"
        >
          <span className="text-[1.2rem] font-light">{"\u2039"}</span>
          <span>Back to Maze</span>
        </button>
        <div className="flex gap-4">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className="text-[0.85rem] font-normal text-text-primary opacity-80 transition-opacity duration-150 hover:opacity-100"
              id={item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-[980px] flex-1 flex-col px-6">
        <header className="mb-12 mt-12 text-center md:mb-24 md:mt-24">
          <h1 className="mb-4 text-[2.5rem] font-bold tracking-[-0.03em] text-text-primary md:text-[3.5rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto max-w-[680px] text-[1.1rem] text-text-secondary md:text-[1.25rem]">
              {subtitle}
            </p>
          )}
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-24 border-t border-border-subtle pb-8 pt-16 text-center">
          <p className="text-[0.85rem] text-text-muted">
            © 2026 Designed and Developed by Jax. Built with React and Three.js.
          </p>
        </footer>
      </div>
    </div>
  );
}
