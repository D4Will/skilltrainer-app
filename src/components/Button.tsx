import "../App.css";
import type { ReactNode } from "react";

interface Props {
  onClick: () => void;
  isActive: boolean;
  children: ReactNode;
}

const Button = ({ onClick, isActive, children }: Props) => {
  const className = isActive ? "target-selector-active" : "target-selector";

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;
