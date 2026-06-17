# Sports Standings Application

Application URL:

## Summary

Sports Standings Application is a React and Redux Toolkit application for managing tournament standings. It supports multiple tournament types, participant registration, score submission, standings calculation, recent match display, country flags for supported tournaments, and local persistence after page refresh.

The project currently includes tournament views for Premier League, EuroBasket, and Wimbledon, each with its own configuration and visual style.

## Installation

This project uses Yarn for package management.

If Yarn is not installed on your machine, install it with one of these options:

```bash
corepack enable
```

or:

```bash
npm install --global yarn
```

After Yarn is available, install the project dependencies:

```bash
yarn
```

Useful project commands:

```bash
yarn dev
yarn build
yarn lint
yarn test:run
```

## Main Functionalities

- Add teams or players to a tournament.
- Add match scores between two participants.
- Validate score submission so a match cannot be added until at least two participants exist.
- Prevent the same participant from playing against themselves.
- Prevent duplicate matches between the same pair of participants.
- Automatically update standings after every valid score:
  - win: 3 points
  - draw: 1 point
  - loss: 0 points
- Sort standings by points, with participant name as a stable secondary sort.
- Persist tournament data in `localStorage` so standings remain after refresh.
- Show recent matches for tournaments that enable this feature.
- Support different participant modes:
  - regular team/player name input
  - national-team mode, where the participant is selected from the country list
  - participant-country mode, where a team/player can have an associated country flag
- Show country flags for tournaments configured to use country data.

## Country Flags And National Teams

Country flag behavior is configured per tournament. A tournament can choose not to use countries, use countries as optional participant metadata, or behave as a national-team tournament.

For national-team tournaments, users select the country directly instead of typing a separate team name. For tournaments that only want to display a country flag beside a team or player, the application can keep the participant name input and add a country selection list.

This keeps the feature scalable: future tournaments can enable flag support by changing tournament configuration instead of rewriting form or table logic.

## Disclaimer: Flag Icons Bundle Size

The project currently imports the full `flag-icons` stylesheet in `src/main.tsx`:

```ts
import "flag-icons/css/flag-icons.min.css";
```

This is convenient, but it is heavy because it includes styles and assets for every flag, even if the application only displays a small subset.

To reduce the production build size, the flag loading should be optimized later. Possible improvements:

- Import only the specific flag assets needed by the configured country list.
- Use a Vite `import.meta.glob` strategy with a controlled whitelist of supported country codes.
- Replace the full stylesheet import with a small custom flag component that only resolves known, valid country codes.
- Split flag assets into lazy-loaded chunks if future pages require many optional flags.

The important rule is to keep flag codes validated against the application country constants, so user input cannot request arbitrary files.
