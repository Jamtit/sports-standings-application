import type { Participant, TournamentTypes } from "../types/tournaments.types";
import Button from "../../../shared/components/Button";
import Select from "../../../shared/components/Select";
import "./AddScoreForm.scss";
import { useState } from "react";

type AddScoreFormProps = {
  tournamentType: TournamentTypes;
  participantLabel: string;
  participants: Participant[];
};

function AddScoreForm({
  tournamentType,
  participantLabel,
  participants,
}: AddScoreFormProps) {
  const [participantAId, setParticipantAId] = useState<string>("");
  const [participantBId, setParticipantBId] = useState<string>("");

  const participantOptions = participants.map((participant) => ({
    label: participant.stats.name,
    value: participant.id,
  }));

  const secondParticipantOptions = participants
    .filter((participant) => participant.id === participantAId)
    .map((participant) => ({
      label: participant.stats.name,
      value: participant.id,
    }));

  return (
    <div className={`add-score add-score--${tournamentType}`}>
      <h4 className="add-score__label">Add Score</h4>
      <div className="add-score__container">
        <div className="add-score__container__choices">
          <Select
            id="participant-a"
            selectSize="medium"
            placeholder={`Home ${participantLabel}`}
            options={participantOptions}
            value={participantAId}
            onChange={(event) => setParticipantAId(event.target.value)}
            className={`add-score__container__choices__option-a add-score__container__choices__option-a--${tournamentType}`}
          />
          <input
            className={`add-score__container__choices__input-a add-score__container__choices__input-a--${tournamentType}`}
            placeholder="Home Score"
          ></input>
          <Select
            id="participant-b"
            selectSize="medium"
            placeholder={`Away ${participantLabel}`}
            options={secondParticipantOptions}
            value={participantBId}
            onChange={(event) => setParticipantBId(event.target.value)}
            className={`add-score__container__choices__option-b add-score__container__choices__option-b--${tournamentType}`}
          />
          <input
            className={`add-score__container__choices__input-b add-score__container__choices__input-b--${tournamentType}`}
            placeholder="Home Score"
          ></input>
        </div>
        <Button
          size={"full"}
          className={`add-score__container__button add-score__container__button--${tournamentType}`}
        >
          Add Score
        </Button>
      </div>
    </div>
  );
}

export default AddScoreForm;
