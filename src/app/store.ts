import { configureStore } from "@reduxjs/toolkit";
import tournamentReducer from "../features/tournaments/store/tournamentSlice";

export const store = configureStore({
  reducer: {
    tournaments: tournamentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
