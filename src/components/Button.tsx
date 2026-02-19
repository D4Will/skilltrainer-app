import "../App.css";
import type { ReactNode } from "react";

interface Props {
  className: string;
  activeClassName: string;
  onClick: () => void;
  isActive: boolean;
  children: ReactNode;
}

const Button = ({
  className,
  activeClassName,
  onClick,
  isActive,
  children,
}: Props) => {
  const klass = isActive ? activeClassName : className;

  return (
    <button onClick={onClick} className={klass}>
      {children}
    </button>
  );
};

export default Button;
