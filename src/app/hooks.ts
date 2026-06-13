import type { RootState, AppDispatch } from "./store";
import { useDispatch, useSelector } from "react-redux";
import type { TournamentTypes } from "../features/tournaments/types/tournaments.types";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useTournamentTypes = () => {
  return useAppSelector(
    (state) => Object.keys(state.tournaments.tournaments) as TournamentTypes[],
  );
};
