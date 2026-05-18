import { useFpsStore } from "../../store/fpsStore";

const BUILD_SUFFIX = "112084";

type MainMenuChromeProps = {
  version: string;
};

export function MainMenuChrome({ version }: MainMenuChromeProps) {
  const fps = useFpsStore((s) => s.fps);

  return (
    <>
      <p className="main-menu__chrome main-menu__chrome--fps">
        <span className="main-menu__fps-value">{fps ?? "—"}</span> FPS
      </p>
      <p className="main-menu__chrome main-menu__chrome--version">
        Version {version}-{BUILD_SUFFIX}
      </p>
    </>
  );
}
