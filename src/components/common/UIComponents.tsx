import type { ReactNode } from 'react';
import '../../styles/pages.css';

interface CardProps {
  children: ReactNode;
  className?: string;
  accentColor?: string;
}

export function Card({ children, className = '', accentColor }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {accentColor && (
        <div
          style={{
            height: 3,
            borderRadius: 2,
            background: `linear-gradient(to right, ${accentColor}, transparent)`,
            marginBottom: 'var(--space-sm)',
          }}
        />
      )}
      {children}
    </div>
  );
}

export function Grid({ children, columns = 2 }: { children: ReactNode; columns?: 2 | 3 }) {
  return <div className={`grid-${columns}`}>{children}</div>;
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}

export function TagList({ children }: { children: ReactNode }) {
  return <div className="tags">{children}</div>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="section-title">{children}</h2>;
}
