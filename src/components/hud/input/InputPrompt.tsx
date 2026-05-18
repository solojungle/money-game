import type { ControlBinding } from "../../../controls/inputPromptTypes";
import { INPUT_PROMPT_SRC } from "./inputPromptMap";
import "./input-prompt.css";

type InputPromptProps = {
  binding: ControlBinding;
  className?: string;
};

export function InputPrompt({ binding, className = "" }: InputPromptProps) {
  const src = INPUT_PROMPT_SRC[binding];
  return (
    <img
      className={`input-prompt ${className}`.trim()}
      src={src}
      alt=""
      draggable={false}
    />
  );
}
