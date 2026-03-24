import { useCallback, useState } from "react";
import { GameScene } from "./components/GameScene";
import { TitleScreen } from "./components/TitleScreen";
import "./App.css";

function App() {
  const [started, setStarted] = useState(false);
  const handleStart = useCallback(() => setStarted(true), []);

  return (
    <div className="app">
      <GameScene />
      {!started && (
        <div className="app__overlay">
          <TitleScreen onStart={handleStart} />
        </div>
      )}
      {started && (
        <div className="app__hud" role="status">
          <span>Scene active — build your game loop here.</span>
        </div>
      )}
    </div>
  );
}

export default App;
