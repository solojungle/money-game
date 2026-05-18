import { useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import "./PickupFloat.css";

const FLOAT_MS = 700;

function PickupFloatItem({ id, text }: { id: string; text: string }) {
  const dismiss = useGameStore((s) => s.dismissPickupFloat);

  useEffect(() => {
    const t = window.setTimeout(() => dismiss(id), FLOAT_MS);
    return () => window.clearTimeout(t);
  }, [id, dismiss]);

  return (
    <p className="pickup-float" role="status">
      {text}
    </p>
  );
}

export function PickupFloatStack() {
  const floats = useGameStore((s) => s.pickupFloats);

  if (floats.length === 0) return null;

  return (
    <div className="pickup-float-stack" aria-label="Pickup feedback">
      {floats.map((f) => (
        <PickupFloatItem key={f.id} id={f.id} text={f.text} />
      ))}
    </div>
  );
}
