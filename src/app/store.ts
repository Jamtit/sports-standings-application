import { configureStore } from "@reduxjs/toolkit";
import tournamentReducer, {
  type TournamentState,
} from "../features/tournaments/store/tournamentSlice";

const STORAGE_KEY = "sports-standings:tournaments";

function loadPersistedTournamentState():
  | { tournaments: TournamentState }
  | undefined {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
      return undefined;
    }

    const tournaments = JSON.parse(savedState) as TournamentState;

    if (!tournaments || typeof tournaments !== "object") {
      return undefined;
    }

    return { tournaments };
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    tournaments: tournamentReducer,
  },
  preloadedState: loadPersistedTournamentState(),
});

store.subscribe(() => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(store.getState().tournaments),
  );
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
