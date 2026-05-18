import { ZoneOverlapContext, type ZoneApi } from "./ZoneOverlapContext";

/** Legacy zone overlap API — interaction focus uses camera raycast instead. */
const noopApi: ZoneApi = {
  enter: () => {},
  exit: () => {},
};

export function ZoneOverlapProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ZoneOverlapContext.Provider value={noopApi}>
      {children}
    </ZoneOverlapContext.Provider>
  );
}
