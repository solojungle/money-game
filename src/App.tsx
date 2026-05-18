import { useGameAudio } from "./audio/useGameAudio";
import { usePdaKeyboard } from "./controls/usePdaKeyboard";
import { GameScene } from "./components/scene/GameScene";
import { GameHUD } from "./components/hud/GameHUD";
import { FabricatorShell } from "./components/hud/fabricator/FabricatorShell";
import { InventoryScreen } from "./components/hud/InventoryScreen";
import { StorageLockerShell } from "./components/hud/storage/StorageLockerShell";
import { MainMenu } from "./components/main-menu/MainMenu";
import { useGameStore } from "./store/gameStore";
import "./App.css";

function App() {
  const audio = useGameAudio();
  usePdaKeyboard();
  const started = useGameStore((s) => s.started);
  const startGame = useGameStore((s) => s.startGame);
  const inventoryOpen = useGameStore((s) => s.inventoryOpen);
  const fabricatorOpen = useGameStore((s) => s.fabricatorOpen);
  const storageOpen = useGameStore((s) => s.storageOpen);
  const stationOpen = fabricatorOpen || storageOpen;

  return (
    <div
      className={`app${inventoryOpen ? " app--pda-open" : ""}${stationOpen ? " app--station-open" : ""}`}
    >
      <GameScene started={started} audio={audio} />
      {!started && (
        <div className="app__overlay">
          <MainMenu onStart={startGame} />
        </div>
      )}
      <GameHUD />
      <InventoryScreen />
      <FabricatorShell />
      <StorageLockerShell />
    </div>
  );
}

export default App;
