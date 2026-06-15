import "./TournamentCardHeader.scss";
import Icon from "../../../../shared/components/Icon";
import type { TOURNAMENT_ICONS } from "../../constants/icons";

type TournamentCardHeaderProps = {
  title: string;
  icon?: keyof typeof TOURNAMENT_ICONS | "";
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
      {icon && (
        <Icon className="tournament-card-header__icon" name={icon} size={30} />
      )}
      <h3 className="tournament-card-header__title">{title}</h3>
    </div>
  );
}

export default TournamentCardHeader;
