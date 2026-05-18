type MainMenuButtonProps = {
  variant: "primary" | "utility";
  label: string;
  onClick?: () => void;
};

export function MainMenuButton({
  variant,
  label,
  onClick,
}: MainMenuButtonProps) {
  return (
    <button
      type="button"
      className={`sn-btn sn-btn--${variant}`}
      onClick={onClick}
    >
      {variant === "primary" && (
        <span className="sn-btn__icon" aria-hidden>
          <span className="sn-btn__rings">
            <span className="sn-btn__dot" />
          </span>
        </span>
      )}
      <span className={variant === "primary" ? "sn-btn__label" : undefined}>
        {label}
      </span>
    </button>
  );
}
