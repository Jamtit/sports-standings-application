import type { TournamentTypes } from "../types/tournaments.types";
import Button from "../../../shared/components/Button";
import "./AddTeamForm.scss";
import {
  useAppDispatch,
  useTournamentParticipants,
} from "../../../app/hooks";
import { addParticipant } from "../store/tournamentSlice";
import { useState } from "react";
import { formatParticipantName } from "../../../shared/utils/utils";

type AddTeamFormProps = {
  tournamentType: TournamentTypes;
  participantLabel: "Player" | "Team";
  showForm: (value: boolean) => void;
};

function AddTeamForm({
  tournamentType,
  participantLabel,
  showForm,
}: AddTeamFormProps) {
  const [participantName, setParticipantName] = useState<string>("");
  const dispatch = useAppDispatch();
  const participants = useTournamentParticipants(tournamentType);
  const formattedName = formatParticipantName(participantName);
  const participantNameExists = participants.some(
    (participant) =>
      participant.stats.name.toLowerCase() === formattedName.toLowerCase(),
  );
  const isSubmitDisabled = !formattedName || participantNameExists;

  const handleTeamSubmit: React.SubmitEventHandler<HTMLFormElement> = (
    event,
  ) => {
    event.preventDefault();

    if (isSubmitDisabled) {
      return;
    }

    dispatch(
      addParticipant({
        tournamentType,
        participantName: formattedName,
      }),
    );

    showForm(false);
    setParticipantName("");
  };
  return (
    <div className={`add-team add-team--${tournamentType}`}>
      <span className="add-team__label">Add {participantLabel}</span>
      <div>
        <form onSubmit={handleTeamSubmit} className="add-team__input">
          <input
            className={`add-team__input__field add-team__input__field--${tournamentType}`}
            placeholder={`${participantLabel} Name`}
            value={participantName}
            onChange={(event) => setParticipantName(event.target.value)}
          ></input>
          <Button
            className={`add-team__input__button add-team__input__button--${tournamentType}`}
            size="medium"
            variant="accent"
            type="submit"
            disabled={isSubmitDisabled}
          >
            Add
          </Button>
        </form>
        {participantNameExists && (
          <p className="add-team__error">
            This {participantLabel.toLowerCase()} is already added.
          </p>
        )}
      </div>
    </div>
  );
}

export default AddTeamForm;
