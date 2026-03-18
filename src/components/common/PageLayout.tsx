import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages.css";

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  accentColor?: string;
}

export default function PageLayout({
  title,
  subtitle,
  children,
  accentColor = "#6c5ce7",
}: PageLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper page-enter">
      <nav className="page-nav glass">
        <button
          className="back-btn"
          onClick={() => navigate("/")}
          id="back-to-maze"
          style={{ "--accent": accentColor } as React.CSSProperties}
        >
          <span className="back-arrow">←</span>
          <span>Back to Maze</span>
        </button>
        <div className="nav-links">
          <button
            onClick={() => navigate("/about")}
            className="nav-link"
            id="nav-link-about"
          >
            About
          </button>
          <button
            onClick={() => navigate("/portfolio")}
            className="nav-link"
            id="nav-link-portfolio"
          >
            Portfolio
          </button>
          <button
            onClick={() => navigate("/blog")}
            className="nav-link"
            id="nav-link-blog"
          >
            Blog
          </button>
        </div>
      </nav>

      <header className="page-header">
        <h1
          className="page-title"
          style={{ "--accent": accentColor } as React.CSSProperties}
        >
          {title}
        </h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </header>

      <main className="page-content">{children}</main>

      <footer className="page-footer">
        <p>Built with ❤️ and Three.js</p>
      </footer>
    </div>
  );
}
