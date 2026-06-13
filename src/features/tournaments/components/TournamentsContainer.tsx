import { useTournamentTypes } from "../../../app/hooks";
import type { TournamentTypes } from "../types/tournaments.types";

function TournamentsContainer() {
  const existingTournamentTypes: TournamentTypes[] = useTournamentTypes();

  return <section></section>;
}

export default TournamentsContainer;
