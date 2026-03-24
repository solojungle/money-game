type TitleScreenProps = {
  onStart?: () => void;
};

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className="title-screen">
      <header className="title-screen__header">
        <p className="title-screen__eyebrow">A browser game</p>
        <h1 className="title-screen__title">Money Game</h1>
        <p className="title-screen__subtitle">
          React · Three.js · Rapier · Yuka · TensorFlow.js
        </p>
        <p className="title-screen__credit">
          a game made by Adam, Abo, Ali, Zack
        </p>
      </header>
      <div className="title-screen__actions">
        <button
          type="button"
          className="title-screen__btn title-screen__btn--primary"
          onClick={onStart}
        >
          Start
        </button>
        <button
          type="button"
          className="title-screen__btn title-screen__btn--ghost"
          disabled
        >
          Options
        </button>
      </div>
      <p className="title-screen__hint">
        Press Start to acknowledge the stack — gameplay comes next.
      </p>
    </div>
  );
}
