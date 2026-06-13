import type { TournamentTypes } from "../../types/tournaments.types";
import { useAppSelector } from "../../../../app/hooks";
import "./TournamentCard.scss";
import TournamentCardHeader from "./TournamentCardHeader";

type TournamentCardProps = {
  tournamentType: TournamentTypes;
};

function TournamentCard({ tournamentType }: TournamentCardProps) {
  const tournamentData = useAppSelector(
    (state) => state.tournaments.tournaments[tournamentType],
  );
  return (
    <div className={`tournament-card tournament-card--${tournamentType}`}>
      <TournamentCardHeader
        title={tournamentData.name}
        tournamentType={tournamentType}
      />
    </div>
  );
}

export default TournamentCard;
