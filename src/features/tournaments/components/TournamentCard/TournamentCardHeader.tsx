import "./TournamentCardHeader.scss";

type TournamentCardHeaderProps = {
  title: string;
  icon?: React.ReactNode;
  tournamentType: string;
};

function TournamentCardHeader({
  title,
  icon,
  tournamentType,
}: TournamentCardHeaderProps) {
  return (
    <div
      className={`tournament-card-header tournament-card-header--${tournamentType}`}
    >
      {icon && <span className="tournament-card-header__icon">{icon}</span>}
      <h3 className="tournament-card-header__title">{title}</h3>
    </div>
  );
}

export default TournamentCardHeader;
