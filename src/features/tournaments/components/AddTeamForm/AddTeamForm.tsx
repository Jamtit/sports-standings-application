import type {
  TournamentCountryMode,
  TournamentTypes,
} from "../../types/tournaments.types";
import Button from "../../../../shared/components/Button";
import Select from "../../../../shared/components/Select";
import "./AddTeamForm.scss";
import {
  useAppDispatch,
  useTournamentParticipants,
} from "../../../../app/hooks";
import { addParticipant } from "../../store/tournamentSlice";
import { useState } from "react";
import { formatParticipantName } from "../../../../shared/utils";
import {
  COUNTRIES,
  isCountryCode,
  type CountryCode,
} from "../../../../shared/constants/countries";
import {
  isNationalTeamMode,
  shouldShowParticipantNameInput,
  usesCountries,
} from "../../utils/countryMode";

type AddTeamFormProps = {
  tournamentType: TournamentTypes;
  participantLabel: "Player" | "Team";
  showForm: (value: boolean) => void;
  showActionForms: boolean;
  countryMode: TournamentCountryMode;
};

function AddTeamForm({
  tournamentType,
  participantLabel,
  showForm,
  showActionForms,
  countryMode,
}: AddTeamFormProps) {
  const [participantName, setParticipantName] = useState<string>("");
  const [countryCode, setCountryCode] = useState<CountryCode | "">("");
  const dispatch = useAppDispatch();
  const participants = useTournamentParticipants(tournamentType);
  const countryOptions = COUNTRIES.map((country) => ({
    label: country.name,
    value: country.code,
  }));
  const showCountrySelect = usesCountries(countryMode);
  const showParticipantNameInput = shouldShowParticipantNameInput(countryMode);
  const selectedCountry = COUNTRIES.find(
    (country) => country.code === countryCode,
  );
  const isNationalTeam = isNationalTeamMode(countryMode);

  const formattedName = formatParticipantName(participantName);
  const participantNameToSubmit = isNationalTeam
    ? (selectedCountry?.name ?? "")
    : formattedName;
  const participantNameExists = participants.some(
    (participant) =>
      participant.stats.name.toLowerCase() ===
      participantNameToSubmit.toLowerCase(),
  );
  const isCountryMissing = showCountrySelect && !countryCode;

  const isParticipantNameMissing = !participantNameToSubmit;
  const isSubmitDisabled =
    isParticipantNameMissing || participantNameExists || isCountryMissing;
  const duplicateEntityLabel = isNationalTeam
    ? "country"
    : participantLabel.toLowerCase();

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
        participantName: participantNameToSubmit,
        country: countryCode || undefined,
      }),
    );

    if (!showActionForms) {
      showForm(false);
    }

    setParticipantName("");
    setCountryCode("");
  };
  return (
    <div className={`add-team add-team--${tournamentType}`}>
      <span className="add-team__label">Add {participantLabel}</span>
      <div>
        <form
          onSubmit={handleTeamSubmit}
          className={`add-team__input ${
            isNationalTeam ? "add-team__input--national-team" : ""
          }`}
        >
          {showParticipantNameInput && (
            <input
              className={`add-team__input__field add-team__input__field--${tournamentType}`}
              placeholder={`${participantLabel} Name`}
              value={participantName}
              onChange={(event) => setParticipantName(event.target.value)}
            ></input>
          )}
          {showCountrySelect && (
            <Select
              id={`${tournamentType}-country`}
              selectSize="medium"
              placeholder="Country"
              options={countryOptions}
              value={countryCode}
              onChange={(event) => {
                const nextCountryCode = event.target.value;

                setCountryCode(
                  isCountryCode(nextCountryCode) ? nextCountryCode : "",
                );
              }}
              className={`add-team__input__country add-team__input__country--${tournamentType}`}
            />
          )}
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
            This {duplicateEntityLabel} is already added.
          </p>
        )}
      </div>
    </div>
  );
}

export default AddTeamForm;
