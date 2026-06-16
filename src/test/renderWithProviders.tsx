import { configureStore } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";
import type { PropsWithChildren, ReactElement } from "react";
import { Provider } from "react-redux";
import tournamentReducer, {
  type TournamentState,
} from "../features/tournaments/store/tournamentSlice";

type TestRootState = {
  tournaments: TournamentState;
};

export function setupTestStore(preloadedState?: TestRootState) {
  return configureStore({
    reducer: {
      tournaments: tournamentReducer,
    },
    preloadedState,
  });
}

type AppStore = ReturnType<typeof setupTestStore>;

type ExtendedRenderOptions = {
  preloadedState?: TestRootState;
  store?: AppStore;
} & Omit<RenderOptions, "wrapper">;

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = setupTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
