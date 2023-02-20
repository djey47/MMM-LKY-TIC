import './Badge.scss';

export interface BadgeProps {
  text: string;
};

const Badge: React.FC<BadgeProps> = (props: BadgeProps) => {
  return (
    <span className="badge">
      {props.text}
    </span>
  );
};

export default Badge;
