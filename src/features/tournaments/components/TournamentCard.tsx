import type { TournamentTypes } from "../types/tournaments.types";
import { useAppSelector } from "../../../app/hooks";
import "./TournamentCard.scss";

type TournamentCardProps = {
  tournamentType: TournamentTypes;
};

function TournamentCard({ tournamentType }: TournamentCardProps) {
  const tournamentData = useAppSelector(
    (state) => state.tournaments.tournaments[tournamentType],
  );
  return (
    <div className={`tournament-card tournament-card--${tournamentType}`}>
      Tournament: {tournamentData.name}
    </div>
  );
}

export default TournamentCard;
