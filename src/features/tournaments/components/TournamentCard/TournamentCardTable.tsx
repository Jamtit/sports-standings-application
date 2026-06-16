import { memo } from "react";
import { useSortedTournamentParticipants } from "../../../../app/hooks";
import { TickIcon, XIcon } from "../../../../assets/icons";
import FlagIcon from "../../../../shared/components/FlagIcon";
import { getCountryName } from "../../../../shared/constants/countries";
import type {
  TournamentCountryMode,
  TournamentTypes,
} from "../../types/tournaments.types";
import { usesCountries } from "../../utils/countryMode";
import "./TournamentCardTable.scss";
import { TOURNAMENT_STRINGS } from "../../constants/strings";

type TournamentCardTableProps = {
  tournamentType: TournamentTypes;
  participantLabel: "Team" | "Player";
  playName: "P" | "M";
  showDraws?: boolean;
  showMatches?: boolean;
  showWinLossIcon?: boolean;
  countryMode: TournamentCountryMode;
  tableLabel?: string;
};

const TABLE_ICON_SIZE: number = 14;

function TournamentCardTable({
  tournamentType,
  playName,
  participantLabel,
  showDraws = true,
  showMatches = true,
  showWinLossIcon = false,
  countryMode,
  tableLabel,
}: TournamentCardTableProps) {
  const columnCount: number = 4 + Number(showDraws) + Number(showMatches);
  const participantRows = useSortedTournamentParticipants(tournamentType);
  const showParticipantFlags = usesCountries(countryMode);

  return (
    <div className="tournament-card-table">
      {tableLabel && (
        <h4 className="tournament-card-table__label">{tableLabel}</h4>
      )}
      <table className="tournament-card-table__table">
        <thead
          className={`tournament-card-table__table__header tournament-card-table__table__header--${tournamentType}`}
        >
          <tr>
            <th>{participantLabel}</th>
            {showMatches && <th>{playName}</th>}
            <th>{TOURNAMENT_STRINGS.tournamentCardTable.columns.wins}</th>
            {showDraws && (
              <th>{TOURNAMENT_STRINGS.tournamentCardTable.columns.draws}</th>
            )}
            <th>{TOURNAMENT_STRINGS.tournamentCardTable.columns.losses}</th>
            <th>{TOURNAMENT_STRINGS.tournamentCardTable.columns.points}</th>
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
                {TOURNAMENT_STRINGS.tournamentCardTable.messages.noParticipants(
                  participantLabel,
                )}
              </td>
            </tr>
          ) : (
            participantRows.map((participant) => (
              <tr key={participant.id}>
                <td>
                  <span className="tournament-card-table__participant">
                    {showParticipantFlags && participant.country && (
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
                <td className="tournament-card-table__table__body__win-column">
                  {participant.stats.wins}
                  {showWinLossIcon && (
                    <TickIcon
                      className="tournament-card-table__table__body__win-column__tick-icon"
                      size={TABLE_ICON_SIZE}
                    />
                  )}
                </td>
                {showDraws && <td>{participant.stats.draws}</td>}
                <td className="tournament-card-table__table__body__loss-column">
                  {participant.stats.losses}
                  {showWinLossIcon && (
                    <XIcon
                      className="tournament-card-table__table__body__loss-column__x-icon"
                      size={TABLE_ICON_SIZE}
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
                {TOURNAMENT_STRINGS.tournamentCardTable.messages.addOneMoreParticipant(
                  participantLabel,
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default memo(TournamentCardTable);
