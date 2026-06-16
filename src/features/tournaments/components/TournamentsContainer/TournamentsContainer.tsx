import { useTournamentTypes } from "../../../../app/hooks";
import type { TournamentTypes } from "../../types/tournaments.types";
import TournamentCard from "../TournamentCard";
import "./TournamentsContainer.scss";

function TournamentsContainer() {
  const existingTournamentTypes: TournamentTypes[] = useTournamentTypes();

  return (
    <section className="tournaments-container">
      {existingTournamentTypes.map((type) => (
        <div className={"tournaments-container__item"} key={type}>
          <TournamentCard tournamentType={type} />
        </div>
      ))}
    </section>
  );
}

export default TournamentsContainer;
