import type { TournamentTypes } from "../types/tournaments.types";
import Button from "../../../shared/components/Button";
import "./AddTeamForm.scss";

type AddTeamFormProps = {
  tournamentType: TournamentTypes;
  participantLabel: "Player" | "Team";
};

function AddTeamForm({ tournamentType, participantLabel }: AddTeamFormProps) {
  return (
    <div className={`add-team add-team--${tournamentType}`}>
      <span className="add-team__label">Add {participantLabel}</span>
      <div className="add-team__input">
        <input
          className={`add-team__input__field add-team__input__field--${tournamentType}`}
          placeholder={`${participantLabel} Name`}
        ></input>
        <Button
          className={`add-team__input__button add-team__input__button--${tournamentType}`}
          size="medium"
          variant="accent"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default AddTeamForm;
