export const rankedRaceEvent = {
  id: "ranked-race-2026",
  timeZone: "Europe/Oslo",
  startAt: "2026-08-03T00:00:00+02:00",
  signupClosesAt: "2026-08-05T23:59:59+02:00",
  endAt: "2026-09-01T23:59:59+02:00",
  archiveAt: "2026-09-09T00:00:00+02:00",

  // Add approved players here while the automatic tracking service is being chosen.
  // Later, the backend/API can return this exact same data format.
  participants: {
    league: [
      // {
      //   displayName: "Player name",
      //   account: "GameName#Tag",
      //   profileUrl: "https://op.gg/lol/summoners/euw/GameName-Tag",
      //   startRank: "Silver II, 40 LP",
      //   currentRank: "Silver I, 12 LP",
      //   scoreChange: 72,
      //   wins: 8,
      //   losses: 5,
      //   draws: 0,
      // },
    ],
    valorant: [
      // {
      //   displayName: "Player name",
      //   account: "GameName#Tag",
      //   profileUrl: "https://tracker.gg/valorant/profile/riot/GameName%23Tag/overview",
      //   startRank: "Silver 2, 40 RR",
      //   currentRank: "Gold 1, 12 RR",
      //   scoreChange: 172,
      //   wins: 12,
      //   losses: 7,
      //   draws: 1,
      // },
    ],
  },
};
