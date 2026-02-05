import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const GameInfo = ({ children }: Props) => {
  return <div className="gameinfo">{children}</div>;
};

export default GameInfo;
