export function MainMenuNewsPanel() {
  return (
    <article className="sn-news" aria-label="Featured news">
      <span className="sn-news__corner sn-news__corner--tl" aria-hidden />
      <span className="sn-news__corner sn-news__corner--tr" aria-hidden />
      <span className="sn-news__corner sn-news__corner--bl" aria-hidden />
      <span className="sn-news__corner sn-news__corner--br" aria-hidden />
      <div className="sn-news__media" aria-hidden />
      <div className="sn-news__tags">
        <span className="sn-news__tag">New!</span>
        <span className="sn-news__tag">11 Mar 2026</span>
      </div>
      <p className="sn-news__caption">Voices From Beyond - Lost</p>
    </article>
  );
}
