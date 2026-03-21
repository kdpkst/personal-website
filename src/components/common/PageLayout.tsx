import type { CSSProperties, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  accentColor = "#8eb7ff",
}: PageLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pageShellStyle = {
    "--page-accent": accentColor,
  } as CSSProperties;

  return (
    <div
      style={pageShellStyle}
      className="relative isolate flex min-h-screen flex-col bg-[linear-gradient(180deg,#f8fafc_0%,#f4f6fb_42%,#f8fafc_100%)] text-text-primary"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[440px] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),transparent_36%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.7),transparent_44%)]" />
        <div
          className="absolute left-[-9rem] top-[5rem] h-[22rem] w-[22rem] rounded-full opacity-70 blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, var(--page-accent) 0%, transparent 68%)",
          }}
        />
        <div className="absolute right-[-8rem] top-[10rem] h-[19rem] w-[19rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.86)_0%,transparent_72%)] blur-[100px]" />
        <div className="absolute bottom-[-8rem] left-1/2 h-[18rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.78)_0%,transparent_72%)] blur-[120px]" />
      </div>

      <div className="sticky top-0 z-[100] px-4 pt-4 sm:px-6 md:pt-5">
        <nav className="liquid-glass mx-auto flex max-w-[1240px] flex-col gap-3 overflow-hidden rounded-[30px] border border-white/50 bg-white/55 px-4 py-3 shadow-[0_18px_48px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <button
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/45 bg-white/38 px-4 py-2 text-[0.9rem] font-medium text-text-primary shadow-[0_10px_24px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-white/54"
            onClick={() => navigate("/")}
            id="back-to-maze"
          >
            <span className="text-[1.15rem] font-light">{"\u2039"}</span>
            <span>Back to Maze</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {navItems.map((item) => {
              const isActive =
                item.route === "/blog"
                  ? location.pathname.startsWith("/blog")
                  : location.pathname === item.route;

              return (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className={`rounded-full border px-4 py-2 text-[0.85rem] font-medium backdrop-blur-xl transition-[transform,background-color,box-shadow,color] duration-200 ${
                    isActive
                      ? "border-white/55 bg-white/62 text-text-primary shadow-[0_10px_22px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.86)]"
                      : "border-transparent bg-white/18 text-text-secondary hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/42 hover:text-text-primary hover:shadow-[0_10px_22px_rgba(15,23,42,0.06)]"
                  }`}
                  id={item.id}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-5 md:px-8">
        <header className="mb-10 mt-12 text-center md:mb-20 md:mt-16">
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

        <footer className="mt-20 pb-8 pt-12 md:pt-16">
          <div className="liquid-glass mx-auto max-w-[920px] overflow-hidden rounded-[28px] border border-white/50 bg-white/45 px-6 py-5 text-center shadow-[0_18px_48px_rgba(15,23,42,0.07),inset_0_1px_0_rgba(255,255,255,0.82)] backdrop-blur-2xl">
            <p className="text-[0.85rem] text-text-muted">
              {"\u00A9"} 2026 Designed and Developed by Jax. Built with React and
              Three.js.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
