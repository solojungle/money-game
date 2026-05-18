import type { ReactNode } from "react";
import "./item-grid.css";

type BracketFrameProps = {
  className?: string;
  children: ReactNode;
};

export function BracketFrame({ className = "", children }: BracketFrameProps) {
  const wrapClass = ["item-grid-wrap", "item-grid-wrap--bracketed", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapClass}>
      <span className="item-grid__bracket item-grid__bracket--tl" aria-hidden />
      <span className="item-grid__bracket item-grid__bracket--tr" aria-hidden />
      <span className="item-grid__bracket item-grid__bracket--bl" aria-hidden />
      <span className="item-grid__bracket item-grid__bracket--br" aria-hidden />
      {children}
    </div>
  );
}
