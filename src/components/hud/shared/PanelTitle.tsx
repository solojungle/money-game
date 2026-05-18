import "./panel-title.css";

type PanelTitleProps = {
  title: string;
};

export function PanelTitle({ title }: PanelTitleProps) {
  return (
    <div className="panel-title">
      <h2 className="panel-title__label">{title}</h2>
      <span className="panel-title__rule" aria-hidden />
    </div>
  );
}
