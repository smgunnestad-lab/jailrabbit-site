export const rankedRaceEvent = {
  id: "ranked-race-2026",
  title: "The Jailrabbit Climb",
  eyebrow: "League of Legends + Valorant",
  icon: "🏆",
  cardTheme: "ranked",
  timeZone: "Europe/Oslo",
  signupClosesAt: "2026-08-21T23:59:59+02:00",
  startAt: "2026-08-21T00:00:00+02:00",
  endAt: "2026-09-20T23:59:59+02:00",
  archiveAt: "2026-09-08T00:00:00+02:00",
  hideAfterArchive: true,
  cardDescription:
    "One month, two games and a deeply important amount of bragging rights.",
  intro:
    "Calling all elite, epic and slightly questionable gamers. Climb as far as you can in League of Legends or Valorant during one month. Your starting rank does not matter: the player with the biggest net LP or RR gain wins their game category.",
  cozyNote:
    "Bronze and brave? Challenger and chronically online? Perfect. Everyone is welcome, and the whole point is to climb together, cheer each other on and create a few mildly dramatic Discord moments along the way.",
  rules: [
    "Use your main or highest-ranked account. We will do a quick check so the race stays fair for everyone.",
    "You must already have played at least 10 ranked games this season. Emerald and Diamond players need at least 25.",
    "Duo play with other competitors is allowed. Queue with a friend and have fun, but intentional losing is not allowed.",
    "No boosting, account sharing or suspicious rocket launches through the ranks. Everyone involved will be disqualified.",
    "You may join both League and Valorant. The games have separate leaderboards and one winner each.",
    "Submit your account before sign-ups close. Once the race begins, accounts cannot be swapped and nobody can join midway.",
    "Do not deliberately derank before the event. That defeats the whole cozy competition thing and leads to disqualification.",
    "Keep it friendly. Banter is welcome; toxicity, harassment and overly negative behaviour are not.",
  ],

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

const eventIdeas = [
  {
    id: "minecraft-build-battle",
    title: "Minecraft Build Battle",
    eyebrow: "Event idea",
    icon: "🧱",
    cardTheme: "minecraft",
    cardDescription: "Tiny teams, questionable architecture and a timer that is far too short.",
    intro:
      "A cozy build challenge is being sketched out. Theme, teams and date will be announced once the rabbits have agreed on the important bits.",
  },
  {
    id: "community-game-night",
    title: "Community Game Night",
    eyebrow: "Event idea",
    icon: "🎲",
    cardTheme: "community",
    cardDescription: "A relaxed evening where the game matters less than who causes the chaos.",
    intro:
      "This one is still cooking. Expect easy-to-join party games, plenty of room in voice chat and absolutely no skill requirement.",
  },
  {
    id: "movie-night",
    title: "JailRabbit Movie Night",
    eyebrow: "Event idea",
    icon: "🍿",
    cardTheme: "movie",
    cardDescription: "One movie, too many snacks and live commentary nobody asked for.",
    intro:
      "Movie suggestions and a date will arrive later. Everyone will be welcome when the popcorn portal finally opens.",
  },
];

export const communityEvents = [rankedRaceEvent, ...eventIdeas];
