import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PortalInfo } from "../Maze/mazeData";
import "../../styles/hud.css";

interface HUDProps {
  activePortal: PortalInfo | null;
}

export default function HUD({ activePortal }: HUDProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "About Me", route: "/about", color: "#00cec9", icon: "👤" },
    { label: "Portfolio", route: "/portfolio", color: "#fdcb6e", icon: "🎨" },
    { label: "My Blogs", route: "/blog", color: "#fd79a8", icon: "📄" },
  ];

  return (
    <div className="hud-overlay">
      {/* Menu Button */}
      <button
        className="hud-menu-btn glass"
        onClick={() => setMenuOpen(!menuOpen)}
        id="menu-toggle"
      >
        {menuOpen ? "✕" : "☰"} Menu
      </button>

      {/* Navigation Menu */}
      {menuOpen && (
        <div className="hud-menu glass" id="nav-menu">
          <h3 className="hud-menu-title">Navigate</h3>
          <div className="hud-menu-items">
            {navItems.map((item) => (
              <button
                key={item.route}
                className="hud-menu-item"
                style={{ "--portal-color": item.color } as React.CSSProperties}
                onClick={() => navigate(item.route)}
                id={`nav-${item.route.slice(1)}`}
              >
                <span className="hud-menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Portal Prompt */}
      {activePortal && (
        <div
          className="hud-portal-prompt glass"
          style={
            { "--portal-color": activePortal.color } as React.CSSProperties
          }
        >
          <div className="hud-prompt-icon">🚪</div>
          <div className="hud-prompt-text">
            <span className="hud-prompt-label">
              Press <kbd>Enter</kbd> to open
            </span>
            <span
              className="hud-prompt-name"
              style={{ color: activePortal.color }}
            >
              {activePortal.label}
            </span>
          </div>
        </div>
      )}

      {/* Controls Hint */}
      <div className="hud-controls">
        <span>↑ ↓ ← → to move</span>
        <span>•</span>
        <span>Enter to interact</span>
      </div>
    </div>
  );
}
