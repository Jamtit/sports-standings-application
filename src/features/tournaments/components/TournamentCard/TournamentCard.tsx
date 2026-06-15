import type { TournamentTypes } from "../../types/tournaments.types";
import { useAppSelector } from "../../../../app/hooks";
import "./TournamentCard.scss";
import TournamentCardHeader from "./TournamentCardHeader";
import TournamentCardTable from "./TournamentCardTable";

type TournamentCardProps = {
  tournamentType: TournamentTypes;
};

function TournamentCard({ tournamentType }: TournamentCardProps) {
  const tournamentData = useAppSelector(
    (state) => state.tournaments.tournaments[tournamentType],
  );

  const participantLabel: "Player" | "Team" =
    tournamentType === "wimbledon" ? "Player" : "Team";
  const playName: "M" | "P" = tournamentType === "wimbledon" ? "M" : "P";

  return (
    <div className={`tournament-card tournament-card--${tournamentType}`}>
      <TournamentCardHeader
        title={tournamentData.name}
        tournamentType={tournamentType}
      />
      <TournamentCardTable
        tournamentType={tournamentType}
        participantRows={tournamentData.participants}
        participantLabel={participantLabel}
        playName={playName}
        showDraws={tournamentData.showDraws}
        showMatches={tournamentData.showMatches}
      />
    </div>
  );
}

export default TournamentCard;
