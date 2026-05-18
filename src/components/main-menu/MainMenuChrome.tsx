const BUILD_SUFFIX = "112084";

type MainMenuChromeProps = {
  version: string;
};

export function MainMenuChrome({ version }: MainMenuChromeProps) {
  return (
    <>
      <p className="main-menu__chrome main-menu__chrome--shader">
        Loading Shaders... <time>2.55s</time>
      </p>
      <p className="main-menu__chrome main-menu__chrome--version">
        Version {version}-{BUILD_SUFFIX}
      </p>
    </>
  );
}
