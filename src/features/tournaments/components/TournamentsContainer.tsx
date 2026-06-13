import { useTournamentTypes } from "../../../app/hooks";
import type { TournamentTypes } from "../types/tournaments.types";
import TournamentCard from "./TournamentCard/TournamentCard";
import "./TournamentsContainer.scss";

function TournamentsContainer() {
  const existingTournamentTypes: TournamentTypes[] = useTournamentTypes();

  return (
    <section className="tournaments-container">
      {existingTournamentTypes.map((type) => (
        <TournamentCard key={type} tournamentType={type} />
      ))}
    </section>
  );
}

export default TournamentsContainer;
