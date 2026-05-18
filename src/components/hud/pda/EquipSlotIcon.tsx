import type { ReactElement } from "react";
import type { EquipmentSlotId } from "../../../game/systems/inventory";

type EquipSlotIconProps = {
  slot: EquipmentSlotId;
  className?: string;
};

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function HeadIcon() {
  return (
    <svg {...iconProps}>
      <path d="M8 10c0-2.2 1.8-4 4-4s4 1.8 4 4v1.5c0 .8-.7 1.5-1.5 1.5h-5c-.8 0-1.5-.7-1.5-1.5V10z" />
      <path d="M9 13h6v2.5c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2V13z" />
      <path d="M10 8.5h4M7.5 11h1M15.5 11h1" />
    </svg>
  );
}

function TankIcon() {
  return (
    <svg {...iconProps}>
      <rect x="6" y="5" width="5" height="14" rx="2" />
      <rect x="13" y="5" width="5" height="14" rx="2" />
      <path d="M8.5 8h0M8.5 11h0M15.5 8h0M15.5 11h0" strokeWidth={2.4} />
      <path d="M11.5 19h1" />
    </svg>
  );
}

function SuitIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 4l3 2.5v2L12 11 9 8.5V6.5L12 4z" />
      <path d="M8 11.5l-2 1.5v7h3v-5l1-1 1 1v5h3v-7l-2-1.5" />
      <path d="M10 14h4" />
    </svg>
  );
}

function GlovesIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5.5 12.5c0-1.1.9-2 2-2 .6 0 1.1.3 1.5.7" />
      <path d="M5.5 12.5V16c0 1.7 1.3 3 3 3h.5" />
      <path d="M8 11v6.5" />
      <path d="M18.5 12.5c0-1.1-.9-2-2-2-.6 0-1.1.3-1.5.7" />
      <path d="M18.5 12.5V16c0 1.7-1.3 3-3 3h-.5" />
      <path d="M16 11v6.5" />
    </svg>
  );
}

function FinsIcon() {
  return (
    <svg {...iconProps}>
      <path d="M6 16c2-4 4-6 6-6s4 2 6 6" />
      <path d="M8 16l-1.5 3M16 16l1.5 3" />
      <path d="M9 14.5h6" />
    </svg>
  );
}

const SLOT_ICONS: Record<EquipmentSlotId, () => ReactElement> = {
  head: HeadIcon,
  tank: TankIcon,
  suit: SuitIcon,
  gloves: GlovesIcon,
  fins: FinsIcon,
};

export function EquipSlotIcon({ slot, className }: EquipSlotIconProps) {
  const Icon = SLOT_ICONS[slot];
  return (
    <span className={className ?? "pda-equip__slot-icon"}>
      <Icon />
    </span>
  );
}
