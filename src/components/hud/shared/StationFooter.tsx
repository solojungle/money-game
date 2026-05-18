import type { ReactNode } from "react";
import type { ControlBinding } from "../../../controls/inputPromptTypes";
import { InputPrompt } from "../input/InputPrompt";
import "./station-shell.css";

type StationFooterActionProps = {
  label: string;
  binding: ControlBinding;
  onClick?: () => void;
  muted?: boolean;
};

export function StationFooterAction({
  label,
  binding,
  onClick,
  muted = false,
}: StationFooterActionProps) {
  const className = `station-footer__action${
    muted ? " station-footer__action--muted" : ""
  }`;

  if (muted || !onClick) {
    return (
      <div className={className}>
        <span className="station-footer__label">{label}</span>
        <InputPrompt binding={binding} className="station-footer__key" />
      </div>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      <span className="station-footer__label">{label}</span>
      <InputPrompt binding={binding} className="station-footer__key" />
    </button>
  );
}

type StationFooterProps = {
  children: ReactNode;
};

export function StationFooter({ children }: StationFooterProps) {
  return <footer className="station-footer">{children}</footer>;
}
