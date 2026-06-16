export const TOURNAMENT_STRINGS = {
  addScoreForm: {
    title: "Add Score",
    placeholders: {
      homeParticipant: (participantLabel: string) => `Home ${participantLabel}`,
      awayParticipant: (participantLabel: string) => `Away ${participantLabel}`,
      homeScore: "Home Score",
      awayScore: "Away Score",
    },
    messages: {
      allOpponentsPlayed: (participantLabel: string) =>
        `This ${participantLabel.toLowerCase()} has already played every available opponent.`,
    },
    actions: {
      submit: "Add Score",
    },
  },

  addTeamForm: {
    title: (participantLabel: string) => `Add ${participantLabel}`,
    placeholders: {
      participantName: (participantLabel: string) => `${participantLabel} Name`,
      country: "Country",
    },
    actions: {
      submit: "Add",
    },
    messages: {
      alreadyAdded: (entityLabel: string) =>
        `This ${entityLabel} is already added.`,
    },
    labels: {
      countryEntity: "country",
    },
  },
  currentMatches: {
    versus: "vs",
  },

  tournamentCard: {
    participantLabels: {
      team: "Team",
      player: "Player",
    },
    playLabels: {
      match: "M",
      play: "P",
    },
    actions: {
      addParticipant: (participantLabel: string) => `Add ${participantLabel}`,
      addScore: "Add Score",
    },
  },

  tournamentCardTable: {
    columns: {
      wins: "W",
      draws: "D",
      losses: "L",
      points: "Pts",
    },
    messages: {
      noParticipants: (participantLabel: string) =>
        `No ${participantLabel} are added yet.`,
      addOneMoreParticipant: (participantLabel: string) =>
        `Add 1 more ${participantLabel.toLowerCase()} to start adding scores.`,
    },
  },
} as const;
