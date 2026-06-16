import type { TournamentTypes } from "../../types/tournaments.types";
import { useAppSelector } from "../../../../app/hooks";
import "./TournamentCard.scss";
import TournamentCardHeader from "./TournamentCardHeader";
import TournamentCardTable from "./TournamentCardTable";
import AddTeamForm from "../AddTeamForm";
import AddScoreForm from "../AddScoreForm";
import CurrentMatches from "../CurrentMatches";
import { useState } from "react";
import Button from "../../../../shared/components/Button";
import { PlusIcon } from "../../../../assets/icons";
import { TOURNAMENT_STRINGS } from "../../constants/strings";

type TournamentCardProps = {
  tournamentType: TournamentTypes;
};

const MIN_PARTICIPANT_TO_ADD_SCORE = 2;

function TournamentCard({ tournamentType }: TournamentCardProps) {
  const tournamentData = useAppSelector(
    (state) => state.tournaments.tournaments[tournamentType],
  );

  const [showAddTeamForm, setShowAddTeamForm] = useState<boolean>(
    tournamentData.showActionForms,
  );
  const [showAddScoreForm, setShowAddScoreForm] = useState<boolean>(
    tournamentData.showActionForms,
  );

  const participantLabel: "Player" | "Team" =
    tournamentData.isParticipantAPlayer
      ? TOURNAMENT_STRINGS.tournamentCard.participantLabels.player
      : TOURNAMENT_STRINGS.tournamentCard.participantLabels.team;

  const playName: "M" | "P" = tournamentData.isAMatch
    ? TOURNAMENT_STRINGS.tournamentCard.playLabels.match
    : TOURNAMENT_STRINGS.tournamentCard.playLabels.play;

  return (
    <div className={`tournament-card tournament-card--${tournamentType}`}>
      <TournamentCardHeader
        title={tournamentData.name}
        tournamentType={tournamentType}
        icon={tournamentData.iconName}
      />
      <div className="tournament-card__body">
        {showAddTeamForm && (
          <AddTeamForm
            tournamentType={tournamentType}
            participantLabel={participantLabel}
            showForm={setShowAddTeamForm}
            showActionForms={tournamentData.showActionForms}
            countryMode={tournamentData.countryMode}
          />
        )}

        {showAddScoreForm && (
          <AddScoreForm
            tournamentType={tournamentType}
            participantLabel={participantLabel}
            showForm={setShowAddScoreForm}
            showActionForms={tournamentData.showActionForms}
          />
        )}

        <div className="tournament-card__body__no-forms">
          {!showAddTeamForm && (
            <Button
              className={`tournament-card__body__no-forms__add-participant tournament-card__body__no-forms__add-participant--${tournamentType}`}
              onClick={() => setShowAddTeamForm(true)}
            >
              <PlusIcon
                className="tournament-card__body__no-forms__add-participant__icon"
                size={14}
              />
              {TOURNAMENT_STRINGS.tournamentCard.actions.addParticipant(
                participantLabel,
              )}
            </Button>
          )}
          {!showAddScoreForm && (
            <Button
              className={`tournament-card__body__no-forms__add-score tournament-card__body__no-forms__add-score--${tournamentType}`}
              onClick={() => setShowAddScoreForm(true)}
              disabled={
                tournamentData.participants.length <
                MIN_PARTICIPANT_TO_ADD_SCORE
              }
            >
              <PlusIcon
                className="tournament-card__body__no-forms__add-score__icon"
                size={14}
              />
              {TOURNAMENT_STRINGS.tournamentCard.actions.addScore}
            </Button>
          )}
        </div>

        {tournamentData.showRecentMatches && (
          <CurrentMatches
            tournamentType={tournamentType}
            countryMode={tournamentData.countryMode}
          />
        )}

        <TournamentCardTable
          tournamentType={tournamentType}
          participantLabel={participantLabel}
          playName={playName}
          showDraws={tournamentData.showDraws}
          showMatches={tournamentData.showMatches}
          showWinLossIcon={tournamentData.showWinLossIcons}
          countryMode={tournamentData.countryMode}
          tableLabel={tournamentData.tableLabel}
        />
      </div>
    </div>
  );
}

export default TournamentCard;
