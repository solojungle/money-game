import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { subscribe, type GameEvent } from "../../game/_kernel/events";
import "./BlueprintToast.css";

const MAX_QUEUE = 3;
const AUTO_DISMISS_MS = 5000;

export type BlueprintToastProps = {
  source: string;
  itemName: string;
  icon?: ReactNode;
  viewKey?: string;
  viewHint?: string;
};

type QueuedToast = BlueprintToastProps & { id: string; exiting?: boolean };

function ToastIconInner({ icon }: { icon?: ReactNode }) {
  return (
    <div className="blueprint-toast__icon" aria-hidden>
      {icon ?? <div className="blueprint-toast__icon-box" />}
    </div>
  );
}

function ToastCard({
  source,
  itemName,
  icon,
  viewKey = "TAB",
  viewHint = "TO VIEW IN PDA",
  exiting,
  onDismiss,
  onMouseEnter,
  onMouseLeave,
}: BlueprintToastProps & {
  exiting?: boolean;
  onDismiss: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <article
      className={`blueprint-toast${exiting ? " blueprint-toast--exit" : ""}`}
      role="status"
      aria-live="polite"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="blueprint-toast__tab" aria-hidden />
      <p className="blueprint-toast__header">
        {source} | NEW BLUEPRINT SYNTHESIZED
      </p>
      <ToastIconInner icon={icon} />
      <h2 className="blueprint-toast__title">{itemName} UNLOCKED!</h2>
      <p className="blueprint-toast__footer">
        <span className="blueprint-toast__key">{viewKey}</span>
        {viewHint}
        <button
          type="button"
          onClick={onDismiss}
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            fontSize: "10px",
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </p>
    </article>
  );
}

function eventToToast(
  event: Extract<GameEvent, { type: "blueprint:unlocked" }>,
): QueuedToast {
  return {
    id: `${event.blueprintId}-${Date.now()}`,
    source: event.source,
    itemName: event.displayName,
  };
}

export function BlueprintToastStack() {
  const [queue, setQueue] = useState<QueuedToast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const paused = useRef(new Set<string>());

  const dismiss = useCallback((id: string) => {
    setQueue((q) =>
      q.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    window.setTimeout(() => {
      setQueue((q) => q.filter((t) => t.id !== id));
      const t = timers.current.get(id);
      if (t) clearTimeout(t);
      timers.current.delete(id);
      paused.current.delete(id);
    }, 150);
  }, []);

  const scheduleDismiss = useCallback(
    (id: string) => {
      if (paused.current.has(id)) return;
      const existing = timers.current.get(id);
      if (existing) clearTimeout(existing);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), AUTO_DISMISS_MS),
      );
    },
    [dismiss],
  );

  useEffect(() => {
    return subscribe((event) => {
      if (event.type !== "blueprint:unlocked") return;
      const toast = eventToToast(event);
      setQueue((q) => [toast, ...q].slice(0, MAX_QUEUE));
      scheduleDismiss(toast.id);
    });
  }, [scheduleDismiss]);

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      for (const t of activeTimers.values()) clearTimeout(t);
      activeTimers.clear();
    };
  }, []);

  if (queue.length === 0) return null;

  return (
    <div className="blueprint-toast-stack" aria-label="Blueprint notifications">
      {queue.map((toast) => (
        <ToastCard
          key={toast.id}
          source={toast.source}
          itemName={toast.itemName}
          icon={toast.icon}
          viewKey={toast.viewKey}
          viewHint={toast.viewHint}
          exiting={toast.exiting}
          onDismiss={() => dismiss(toast.id)}
          onMouseEnter={() => {
            paused.current.add(toast.id);
            const t = timers.current.get(toast.id);
            if (t) clearTimeout(t);
          }}
          onMouseLeave={() => {
            paused.current.delete(toast.id);
            scheduleDismiss(toast.id);
          }}
        />
      ))}
    </div>
  );
}
