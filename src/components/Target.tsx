interface Props {
  style: React.CSSProperties;
  onClick: () => void;
}

const Target = ({ style, onClick }: Props) => {
  return <div className="target" onMouseDown={onClick} style={style}></div>;
};

export default Target;
