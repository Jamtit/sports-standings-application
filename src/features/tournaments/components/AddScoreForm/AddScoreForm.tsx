import type { TournamentTypes } from "../../types/tournaments.types";
import Button from "../../../../shared/components/Button";
import Select from "../../../../shared/components/Select";
import "./AddScoreForm.scss";
import { useState } from "react";
import {
  useAppDispatch,
  useAvailableOpponents,
  useTournamentParticipants,
} from "../../../../app/hooks";
import { addMatch } from "../../store/tournamentSlice";

type AddScoreFormProps = {
  tournamentType: TournamentTypes;
  participantLabel: string;
  showForm: (value: boolean) => void;
  showActionForms: boolean;
};

function AddScoreForm({
  tournamentType,
  participantLabel,
  showActionForms,
  showForm,
}: AddScoreFormProps) {
  const [participantAId, setParticipantAId] = useState<string>("");
  const [participantBId, setParticipantBId] = useState<string>("");
  const [scoreA, setScoreA] = useState<string>("");
  const [scoreB, setScoreB] = useState<string>("");
  const dispatch = useAppDispatch();

  const participants = useTournamentParticipants(tournamentType);
  const availableOpponents = useAvailableOpponents(
    tournamentType,
    participantAId,
  );

  const participantOptions = participants.map((participant) => ({
    label: participant.stats.name,
    value: participant.id,
  }));

  const secondParticipantOptions = availableOpponents.map((participant) => ({
    label: participant.stats.name,
    value: participant.id,
  }));

  const isSelectedOpponentAvailable = availableOpponents.some(
    (participant) => participant.id === participantBId,
  );

  const selectedParticipantBId = isSelectedOpponentAvailable
    ? participantBId
    : "";

  const parsedScoreA = Number(scoreA);
  const parsedScoreB = Number(scoreB);
  const areScoresValid =
    scoreA !== "" &&
    scoreB !== "" &&
    Number.isInteger(parsedScoreA) &&
    Number.isInteger(parsedScoreB) &&
    parsedScoreA >= 0 &&
    parsedScoreB >= 0;

  const isSubmitDisabled =
    !participantAId || !selectedParticipantBId || !areScoresValid;

  const handleScoreSubmit: React.SubmitEventHandler<HTMLFormElement> = (
    event,
  ) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    dispatch(
      addMatch({
        tournamentType,
        match: {
          id: crypto.randomUUID(),
          participantAId,
          participantBId: selectedParticipantBId,
          scoreA: parsedScoreA,
          scoreB: parsedScoreB,
        },
      }),
    );

    if (!showActionForms) {
      showForm(false);
    }
    setParticipantAId("");
    setParticipantBId("");
    setScoreA("");
    setScoreB("");
  };

  return (
    <div className={`add-score add-score--${tournamentType}`}>
      <h4 className="add-score__label">Add Score</h4>
      <form className="add-score__container" onSubmit={handleScoreSubmit}>
        <div className="add-score__container__choices">
          <Select
            id="participant-a"
            selectSize="medium"
            placeholder={`Home ${participantLabel}`}
            options={participantOptions}
            value={participantAId}
            onChange={(event) => {
              setParticipantAId(event.target.value);
              setParticipantBId("");
            }}
            className={`add-score__container__choices__option-a add-score__container__choices__option-a--${tournamentType}`}
          />
          <input
            className={`add-score__container__choices__input-a add-score__container__choices__input-a--${tournamentType}`}
            placeholder="Home Score"
            inputMode="numeric"
            min={0}
            step={1}
            type="number"
            value={scoreA}
            onChange={(event) => setScoreA(event.target.value)}
          />
          <Select
            id="participant-b"
            selectSize="medium"
            placeholder={`Away ${participantLabel}`}
            options={secondParticipantOptions}
            value={selectedParticipantBId}
            onChange={(event) => setParticipantBId(event.target.value)}
            disabled={!participantAId || secondParticipantOptions.length === 0}
            className={`add-score__container__choices__option-b add-score__container__choices__option-b--${tournamentType}`}
          />
          <input
            className={`add-score__container__choices__input-b add-score__container__choices__input-b--${tournamentType}`}
            placeholder="Away Score"
            inputMode="numeric"
            min={0}
            step={1}
            type="number"
            value={scoreB}
            onChange={(event) => setScoreB(event.target.value)}
          />
        </div>
        {participantAId && secondParticipantOptions.length === 0 && (
          <p className="add-score__message">
            This {participantLabel.toLowerCase()} has already played every
            available opponent.
          </p>
        )}
        <Button
          size={"full"}
          className={`add-score__container__button add-score__container__button--${tournamentType}`}
          type="submit"
          disabled={isSubmitDisabled}
        >
          Add Score
        </Button>
      </form>
    </div>
  );
}

export default AddScoreForm;
