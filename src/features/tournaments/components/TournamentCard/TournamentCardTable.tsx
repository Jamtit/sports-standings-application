import { memo } from "react";
import { useSortedTournamentParticipants } from "../../../../app/hooks";
import { TickIcon, XIcon } from "../../../../assets/icons";
import FlagIcon from "../../../../shared/components/FlagIcon";
import { getCountryName } from "../../../../shared/constants/countries";
import type { TournamentTypes } from "../../types/tournaments.types";
import "./TournamentCardTable.scss";

type TournamentCardTableProps = {
  tournamentType: TournamentTypes;
  participantLabel: "Team" | "Player";
  playName: "P" | "M";
  showDraws?: boolean;
  showMatches?: boolean;
  showWinLossIcon?: boolean;
  showCountryFlags?: boolean;
  tableLabel?: string;
};

function TournamentCardTable({
  tournamentType,
  playName,
  participantLabel,
  showDraws = true,
  showMatches = true,
  showWinLossIcon = false,
  showCountryFlags = false,
  tableLabel,
}: TournamentCardTableProps) {
  const columnCount: number = 4 + Number(showDraws) + Number(showMatches);
  const participantRows = useSortedTournamentParticipants(tournamentType);

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
                <td>
                  <span className="tournament-card-table__participant">
                    {showCountryFlags && participant.country && (
                      <FlagIcon
                        className="tournament-card-table__participant__flag"
                        code={participant.country}
                        label={getCountryName(participant.country)}
                      />
                    )}
                    <span className="tournament-card-table__participant__name">
                      {participant.stats.name}
                    </span>
                  </span>
                </td>
                {showMatches && <td>{participant.stats.matchesPlayed}</td>}
                <td className="tournamet-card-table__table__body__win-column">
                  {participant.stats.wins}
                  {showWinLossIcon && (
                    <TickIcon
                      className="tournament-card-table__table__body__win-column__tick-icon"
                      size={16}
                    />
                  )}
                </td>
                {showDraws && <td>{participant.stats.draws}</td>}
                <td className="tournament-card-table__table__body__loss-column">
                  {participant.stats.losses}
                  {showWinLossIcon && (
                    <XIcon
                      className="tournament-card-table__table__body__loss-column__x-icon"
                      size={16}
                    />
                  )}
                </td>
                <td>{participant.stats.points}</td>
              </tr>
            ))
          )}
          {participantRows.length === 1 && (
            <tr>
              <td
                colSpan={columnCount}
                className={`tournament-card-table__table__body__empty tournament-card-table__table__body__empty--${tournamentType}`}
              >
                Add 1 more {participantLabel} to start adding scores.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default memo(TournamentCardTable);
