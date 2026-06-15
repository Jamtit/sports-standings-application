import type { TournamentTypes } from "../../types/tournaments.types";
import { useAppSelector } from "../../../../app/hooks";
import "./TournamentCard.scss";
import TournamentCardHeader from "./TournamentCardHeader";
import TournamentCardTable from "./TournamentCardTable";
import AddTeamForm from "../AddTeamForm";
import AddScoreForm from "../AddScoreForm";

type TournamentCardProps = {
  tournamentType: TournamentTypes;
};

function TournamentCard({ tournamentType }: TournamentCardProps) {
  const tournamentData = useAppSelector(
    (state) => state.tournaments.tournaments[tournamentType],
  );

  const participantLabel: "Player" | "Team" =
    tournamentData.isParticipantAPlayer ? "Player" : "Team";
  const playName: "M" | "P" = tournamentData.isAMatch ? "M" : "P";

  return (
    <div className={`tournament-card tournament-card--${tournamentType}`}>
      <TournamentCardHeader
        title={tournamentData.name}
        tournamentType={tournamentType}
        icon={tournamentData.iconName}
      />
      <div className="tournament-card__body">
        <AddTeamForm
          tournamentType={tournamentType}
          participantLabel={participantLabel}
        />
        <AddScoreForm
          tournamentType={tournamentType}
          participantLabel={participantLabel}
          participants={tournamentData.participants}
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
    </div>
  );
}

export default TournamentCard;
