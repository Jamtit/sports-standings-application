import { TickIcon, XIcon } from "../../../../assets/icons";
import type {
  Participant,
  TournamentTypes,
} from "../../types/tournaments.types";
import "./TournamentCardTable.scss";

type TournamentCardTableProps = {
  tournamentType: TournamentTypes;
  participantRows: Participant[];
  participantLabel: "Team" | "Player";
  playName: "P" | "M";
  showDraws?: boolean;
  showMatches?: boolean;
  showWinLossIcon?: boolean;
  tableLabel?: string;
};

function TournamentCardTable({
  tournamentType,
  participantRows,
  playName,
  participantLabel,
  showDraws = true,
  showMatches = true,
  showWinLossIcon = false,
  tableLabel,
}: TournamentCardTableProps) {
  const columnCount: number = 4 + Number(showDraws) + Number(showMatches);

  return (
    <div className="tournament-card-table">
      {tableLabel && <h4>{tableLabel}</h4>}
      <table className="tournament-card-table__table">
        <thead
          className={`tournament-card-table__table__header tournament-card-table__table__header--${tournamentType}`}
        >
          <tr>
            <th>{participantLabel}</th>
            {showMatches && <th>{playName}</th>}
            <th>W</th>
            {showDraws && <th>D</th>}
            <th>L</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody
          className={`tournament-card-table__table__body tournament-card-table__table__body--${tournamentType}`}
        >
          {participantRows.length === 0 ? (
            <tr>
              <td
                colSpan={columnCount}
                className={`tournament-card-table__table__body__empty tournament-card-table__table__body__empty--${tournamentType}`}
              >
                No {participantLabel}s are added yet.
              </td>
            </tr>
          ) : (
            participantRows.map((participant) => (
              <tr key={participant.id}>
                <td>{participant.stats.name}</td>
                {showMatches && <td>{participant.stats.matchesPlayed}</td>}
                <td>
                  {participant.stats.wins}
                  {showWinLossIcon && (
                    <TickIcon
                      className="tournament-card-table__table__body__tick-icon"
                      size={16}
                    />
                  )}
                </td>
                {showDraws && <td>{participant.stats.draws}</td>}
                <td>
                  {participant.stats.losses}
                  {showWinLossIcon && (
                    <XIcon
                      className="tournament-card-table__table__body__x-icon"
                      size={16}
                    />
                  )}
                </td>
                <td>{participant.stats.points}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TournamentCardTable;
