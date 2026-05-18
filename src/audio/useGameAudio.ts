import { useEffect, useState } from "react";
import { createAudioService, type AudioService } from "./audioService";

export function useGameAudio(): AudioService {
  const [svc] = useState(() => createAudioService());
  useEffect(
    () => () => {
      svc.dispose();
    },
    [svc],
  );
  return svc;
}
