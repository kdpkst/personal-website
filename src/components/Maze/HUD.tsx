import { useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import type { PortalInfo } from "../Maze/mazeData";

interface HUDProps {
  activePortal: PortalInfo | null;
}

const navItems = [
  {
    label: "About Me",
    route: "/about",
    color: "#00cec9",
    icon: "\u{1F464}",
  },
  {
    label: "Portfolio",
    route: "/portfolio",
    color: "#fdcb6e",
    icon: "\u{1F3A8}",
  },
  {
    label: "My Blogs",
    route: "/blog",
    color: "#fd79a8",
    icon: "\u{1F4DD}",
  },
] as const;

export default function HUD({ activePortal }: HUDProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col p-6">
      <div
        className="pointer-events-auto absolute right-6 top-6 z-20 flex flex-col items-end gap-2"
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <button
          className="glass rounded-panel border border-white/30 bg-[rgba(30,30,45,0.9)] px-6 py-2 text-[0.9rem] font-semibold tracking-[0.05em] text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-0.5 hover:border-accent-secondary hover:bg-accent-primary hover:shadow-[0_0_20px_rgba(0,102,204,0.3)]"
          onClick={() => setMenuOpen((open) => !open)}
          id="menu-toggle"
        >
          {menuOpen ? "\u2713" : "\u2630"} Menu
        </button>

        {menuOpen && (
          <div
            className="glass w-[180px] bg-[rgba(10,10,15,0.85)] p-6 sm:w-[220px]"
            id="nav-menu"
          >
            <h3 className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-text-secondary">
              Navigate
            </h3>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.route}
                  className="flex items-center gap-2 rounded-[8px] border border-transparent px-4 py-2 text-left text-[0.9rem] text-text-primary transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:translate-x-1 hover:bg-white/5 hover:border-[var(--portal-color)] hover:text-[var(--portal-color)]"
                  style={{ "--portal-color": item.color } as CSSProperties}
                  onClick={() => navigate(item.route)}
                  id={`nav-${item.route.slice(1)}`}
                >
                  <span className="text-[1.1rem]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {activePortal && (
        <div
          className="glass hud-portal-prompt-enter absolute bottom-20 left-1/2 flex -translate-x-1/2 items-center gap-4 whitespace-nowrap bg-[rgba(10,10,15,0.85)] px-4 py-2 sm:px-8 sm:py-4"
          style={{ "--portal-color": activePortal.color } as CSSProperties}
        >
          <div className="text-[1.5rem]">{"\u{1F6AA}"}</div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[0.8rem] text-text-secondary">
              Press{" "}
              <kbd className="inline-block rounded-[4px] border border-white/15 bg-white/10 px-[6px] py-[1px] font-mono text-[0.75rem] text-text-primary">
                Enter
              </kbd>{" "}
              to open
            </span>
            <span
              className="text-[1rem] font-semibold"
              style={{ color: activePortal.color }}
            >
              {activePortal.label}
            </span>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[0.65rem] tracking-[0.05em] text-text-muted sm:text-[0.75rem]">
        <span>{"\u2190 \u2191 \u2193 \u2192"} to move</span>
        <span>{"\u2022"}</span>
        <span>Enter to interact</span>
      </div>
    </div>
  );
}
