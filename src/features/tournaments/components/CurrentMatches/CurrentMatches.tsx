import { useRecentTournamentMatches } from "../../../../app/hooks";
import FlagIcon from "../../../../shared/components/FlagIcon";
import { getCountryName } from "../../../../shared/constants/countries";
import { TOURNAMENT_STRINGS } from "../../constants/strings";
import type {
  TournamentCountryMode,
  TournamentTypes,
} from "../../types/tournaments.types";
import { usesCountries } from "../../utils/countryMode";
import "./CurrentMatches.scss";

type CurrentMatchesProps = {
  countryMode: TournamentCountryMode;
  tournamentType: TournamentTypes;
};

function CurrentMatches({ countryMode, tournamentType }: CurrentMatchesProps) {
  const recentMatches = useRecentTournamentMatches(tournamentType);
  const showParticipantFlags = usesCountries(countryMode);

  if (recentMatches.length === 0) {
    return null;
  }

  return (
    <div className="current-matches">
      {recentMatches.map((match) => (
        <div
          className={`current-matches__row current-matches__row--${tournamentType}`}
          key={match.id}
        >
          <div className="current-matches__participants">
            <span className="current-matches__participant">
              {showParticipantFlags && match.participantA.country && (
                <FlagIcon
                  className="current-matches__participant__flag"
                  code={match.participantA.country}
                  label={getCountryName(match.participantA.country)}
                />
              )}
              {match.participantA.stats.name}
            </span>
            <span className="current-matches__versus">
              {TOURNAMENT_STRINGS.currentMatches.versus}
            </span>
            <span className="current-matches__participant">
              {showParticipantFlags && match.participantB.country && (
                <FlagIcon
                  className="current-matches__participant__flag"
                  code={match.participantB.country}
                  label={getCountryName(match.participantB.country)}
                />
              )}
              {match.participantB.stats.name}
            </span>
          </div>
          <strong className="current-matches__score">
            {match.scoreA} - {match.scoreB}
          </strong>
        </div>
      ))}
    </div>
  );
}

export default CurrentMatches;
