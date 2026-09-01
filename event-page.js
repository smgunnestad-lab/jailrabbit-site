import {
  communityEvents,
  rankedRaceEvent,
} from "./event-config.js";

const eventsGrid =
  document.getElementById("events-grid");

const eventsEmpty =
  document.getElementById("events-empty");

const activeEventsBar =
  document.getElementById(
    "active-events-bar"
  );

const activeEventsTrack =
  document.getElementById(
    "active-events-track"
  );

const eventModal =
  document.getElementById("event-modal");

const modalPanel =
  eventModal.querySelector(
    ".event-modal-panel"
  );

const rankedRaceContent =
  document.getElementById(
    "ranked-race-content"
  );

const ideaContent =
  document.getElementById(
    "idea-content"
  );

const eventStatus =
  document.getElementById(
    "event-status"
  );

const timezoneLabel =
  document.getElementById(
    "timezone-label"
  );

const eventDatesList =
  document.getElementById(
    "event-dates"
  );

const countdownCard =
  document.getElementById(
    "countdown-card"
  );

const countdown =
  document.getElementById("countdown");

const countdownLabel =
  document.getElementById(
    "countdown-label"
  );

const phaseMessage =
  document.getElementById(
    "phase-message"
  );

const leaderboardTitle =
  document.getElementById(
    "leaderboard-title"
  );

const leaderboardBody =
  document.getElementById(
    "leaderboard-body"
  );

const gameTabs = Array.from(
  document.querySelectorAll(
    "[data-game]"
  )
);

const leagueLeaderboardUrl =
  "https://jailrabbit-tracker.smgunnestad.workers.dev/api/leaderboard";

const valorantLeaderboardUrl =
  "https://jailrabbit-tracker.smgunnestad.workers.dev/api/valorant-leaderboard";

let selectedGame = "league";
let openEvent = null;
let lastFocusedElement = null;
let lastPhaseSignature = "";

let liveLeagueParticipants = null;
let liveValorantParticipants = null;

function getEventDates(event) {
  if (!event.startAt) return null;

  return {
    signupClose: new Date(
      event.signupClosesAt
    ),
    start: new Date(event.startAt),
    end: new Date(event.endAt),
    archive: new Date(event.archiveAt),
  };
}

function getPhase(
  event,
  now = new Date()
) {
  const dates = getEventDates(event);

  if (!dates) return "idea";
  if (now >= dates.archive) {
    return "archived";
  }

  if (now > dates.end) {
    return "ended";
  }

  if (now >= dates.start) {
    return "live";
  }

  if (now > dates.signupClose) {
    return "upcoming";
  }

  return "registration";
}

function getPhaseDetails(
  event,
  phase
) {
  const dates = getEventDates(event);

  const phases = {
    registration: {
      status: "Sign-ups open",
      label: "Sign-ups close in",
      message:
        "Drop your main account in the JailRabbit Discord before the doors close.",
      target: dates?.signupClose,
    },

    upcoming: {
      status: "Starting soon",
      label: "The race begins in",
      message:
        "Sign-ups are closed. Get the snacks ready while we prepare the starting line.",
      target: dates?.start,
    },

    live: {
      status: "Live now",
      label: "The race ends in",
      message:
        "The climb is on. Cheer for your people and follow the standings below.",
      target: dates?.end,
    },

    ended: {
      status: "Final results",
      label: "Results stay up for",
      message:
        "GGs all around. The final standings remain available for one week.",
      target: dates?.archive,
    },

    idea: {
      status: "In the burrow",
      label: "Date coming later",
      message:
        "This event is still being planned.",
      target: null,
    },

    archived: {
      status: "Archived",
      label: "Event archived",
      message:
        "This event is no longer available.",
      target: null,
    },
  };

  return phases[phase];
}

function formatEventDate(
  event,
  date,
  includeTime = true
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone:
        event.timeZone ||
        "Europe/Oslo",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",

      ...(includeTime
        ? {
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
          }
        : {}),
    }
  ).format(date);
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(
    0,
    Math.floor(milliseconds / 1000)
  );

  const days = Math.floor(
    totalSeconds / 86400
  );

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  return (
    `${days}d ` +
    `${String(hours).padStart(
      2,
      "0"
    )}h ` +
    `${String(minutes).padStart(
      2,
      "0"
    )}m ` +
    `${String(seconds).padStart(
      2,
      "0"
    )}s`
  );
}

function createEventCard(event, now) {
  const phase = getPhase(
    event,
    now
  );

  const details =
    getPhaseDetails(event, phase);

  const dates = getEventDates(event);

  const card =
    document.createElement("button");

  card.type = "button";

  card.className =
    `event-card event-card--${
      event.cardTheme || "default"
    }`;

  card.dataset.eventId = event.id;

  card.setAttribute(
    "aria-label",
    `Open ${event.title}`
  );

  const artwork =
    document.createElement("span");

  artwork.className =
    "event-card-art";

  artwork.setAttribute(
    "aria-hidden",
    "true"
  );

  artwork.textContent =
    event.icon || "🐇";

  const status =
    document.createElement("span");

  status.className =
    "event-card-status";

  status.dataset.phase = phase;
  status.textContent = details.status;

  const eyebrow =
    document.createElement("span");

  eyebrow.className =
    "event-card-eyebrow";

  eyebrow.textContent =
    event.eyebrow;

  const title =
    document.createElement("strong");

  title.className =
    "event-card-title";

  title.textContent = event.title;

  const description =
    document.createElement("span");

  description.className =
    "event-card-description";

  description.textContent =
    event.cardDescription;

  const footer =
    document.createElement("span");

  footer.className =
    "event-card-footer";

  footer.textContent = dates
    ? `${formatEventDate(
        event,
        dates.start,
        false
      )} · Everyone welcome`
    : "Date TBD · Everyone welcome";

  const openLabel =
    document.createElement("span");

  openLabel.className =
    "event-card-open";

  openLabel.textContent =
    "Open event →";

  card.append(
    artwork,
    status,
    eyebrow,
    title,
    description,
    footer,
    openLabel
  );

  card.addEventListener(
    "click",
    () => showEvent(event)
  );

  return card;
}

function renderEventCards(
  now = new Date()
) {
  const visibleEvents =
    communityEvents.filter(
      (event) => {
        const isArchived =
          getPhase(event, now) ===
          "archived";

        return !(
          isArchived &&
          event.hideAfterArchive
        );
      }
    );

  eventsGrid.replaceChildren(
    ...visibleEvents.map((event) =>
      createEventCard(event, now)
    )
  );

  eventsEmpty.hidden =
    visibleEvents.length > 0;
}

function createTickerItem(event) {
  const button =
    document.createElement("button");

  button.type = "button";

  button.className =
    "active-event-link";

  button.textContent = event.title;

  button.addEventListener(
    "click",
    () => showEvent(event)
  );

  return button;
}

function renderActiveEvents(
  now = new Date()
) {
  const activeEvents =
    communityEvents.filter(
      (event) =>
        [
          "registration",
          "upcoming",
          "live",
        ].includes(
          getPhase(event, now)
        )
    );

  activeEventsBar.hidden =
    activeEvents.length === 0;

  activeEventsTrack.classList.toggle(
    "is-scrolling",
    activeEvents.length > 3
  );

  activeEventsTrack.replaceChildren();

  const tickerEvents =
    activeEvents.length > 3
      ? [
          ...activeEvents,
          ...activeEvents,
        ]
      : activeEvents;

  tickerEvents.forEach(
    (event, index) => {
      const item =
        createTickerItem(event);

      if (
        index >= activeEvents.length
      ) {
        item.setAttribute(
          "aria-hidden",
          "true"
        );
      }

      activeEventsTrack.append(item);
    }
  );
}

function renderRules() {
  const rulesGrid =
    document.getElementById(
      "rules-grid"
    );

  rulesGrid.replaceChildren();

  rankedRaceEvent.rules.forEach(
    (rule, index) => {
      const card =
        document.createElement(
          "article"
        );

      const number =
        document.createElement(
          "span"
        );

      const text =
        document.createElement("p");

      number.className =
        "rule-number";

      number.textContent = String(
        index + 1
      ).padStart(2, "0");

      text.textContent = rule;

      card.append(number, text);
      rulesGrid.append(card);
    }
  );
}

function createPlayerCell(player) {
  const cell =
    document.createElement("td");

  const name =
    document.createElement(
      player.profileUrl
        ? "a"
        : "span"
    );

  name.className = "player-name";

  name.textContent =
    player.displayName;

  if (player.profileUrl) {
    name.href = player.profileUrl;
    name.target = "_blank";
    name.rel =
      "noopener noreferrer";
  }

  const account =
    document.createElement("span");

  account.className =
    "player-account";

  account.textContent =
    player.account;

  cell.append(name, account);

  return cell;
}

function createTextCell(
  value,
  className = ""
) {
  const cell =
    document.createElement("td");

  cell.textContent = value;

  if (className) {
    cell.className = className;
  }

  return cell;
}

function createLeaderboardEmptyRow(
  message
) {
  const row =
    document.createElement("tr");

  const cell =
    document.createElement("td");

  cell.className =
    "leaderboard-empty";

  cell.colSpan = 6;
  cell.textContent = message;

  row.append(cell);
  leaderboardBody.append(row);
}

function renderLeaderboardRows(
  participants,
  game
) {
  leaderboardBody.replaceChildren();

  if (participants.length === 0) {
    const gameLabels = {
      league:
        "League of Legends",
      valorant: "Valorant",
    };

    createLeaderboardEmptyRow(
      `Approved ${
        gameLabels[game]
      } competitors will appear here.`
    );

    return;
  }

  participants.forEach(
    (player, index) => {
      const row =
        document.createElement("tr");

      const result =
        `${player.wins ?? 0} / ` +
        `${player.losses ?? 0} / ` +
        `${player.draws ?? 0}`;

      const hasScore =
        Number.isFinite(
          player.scoreChange
        );

      const gainPrefix =
        hasScore &&
        player.scoreChange > 0
          ? "+"
          : "";

      const scoreClass =
        !hasScore
          ? ""
          : player.scoreChange >= 0
            ? "score-positive"
            : "score-negative";

      row.append(
        createTextCell(
          `#${index + 1}`,
          "place-cell"
        ),

        createPlayerCell(player),

        createTextCell(
          player.startRank ||
            "Locked at start"
        ),

        createTextCell(
          player.currentRank ||
            "Unranked"
        ),

        createTextCell(
          hasScore
            ? `${gainPrefix}${player.scoreChange}`
            : "—",
          scoreClass
        ),

        createTextCell(result)
      );

      leaderboardBody.append(row);
    }
  );
}

function formatLeagueRank(player) {
  if (
    !player.tier ||
    player.tier === "UNRANKED"
  ) {
    return "Unranked";
  }

  const tier =
    player.tier.charAt(0) +
    player.tier
      .slice(1)
      .toLowerCase();

  const division =
    player.division || "";

  return (
    `${tier} ${division}, ` +
    `${player.leaguePoints ?? 0} LP`
  ).trim();
}

function mapLiveLeagueParticipants(
  participants
) {
  return participants
    .map((player) => ({
      displayName: player.player,
      account: player.riotId,

      startRank:
        player.startSnapshotId
          ? formatLeagueRank({
              tier:
                player.startTier,
              division:
                player.startDivision,
              leaguePoints:
                player.startLeaguePoints,
            })
          : "Start rank unavailable",

      currentRank:
        formatLeagueRank(player),

      scoreChange:
        Number.isFinite(
          player.scoreChange
        )
          ? player.scoreChange
          : null,

      wins: Number(
        player.wins || 0
      ),

      losses: Number(
        player.losses || 0
      ),

      draws: Number(
        player.draws || 0
      ),
    }))
    .sort((left, right) => {
      const leftGain =
        Number.isFinite(
          left.scoreChange
        )
          ? left.scoreChange
          : Number.NEGATIVE_INFINITY;

      const rightGain =
        Number.isFinite(
          right.scoreChange
        )
          ? right.scoreChange
          : Number.NEGATIVE_INFINITY;

      return rightGain - leftGain;
    });
}

async function loadLiveLeagueLeaderboard() {
  leaderboardBody.replaceChildren();

  createLeaderboardEmptyRow(
    "Loading live League standings…"
  );

  try {
    const response = await fetch(
      leagueLeaderboardUrl,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Leaderboard request failed"
      );
    }

    const data =
      await response.json();

    liveLeagueParticipants =
      mapLiveLeagueParticipants(
        data.participants || []
      );

    if (
      selectedGame === "league"
    ) {
      renderLeaderboardRows(
        liveLeagueParticipants,
        "league"
      );
    }
  } catch (error) {
    if (
      selectedGame === "league"
    ) {
      leaderboardBody.replaceChildren();

      createLeaderboardEmptyRow(
        "Live League standings are temporarily unavailable. Please try again shortly."
      );
    }
  }
}

function formatValorantRank(
  tierName,
  rr
) {
  return tierName
    ? `${tierName}, ${rr ?? 0} RR`
    : "Unranked";
}

function mapLiveValorantParticipants(
  participants
) {
  return participants
    .map((player) => ({
      displayName: player.player,
      account: player.riotId,

      startRank:
        player.startSnapshotId
          ? formatValorantRank(
              player.startTierName,
              player.startRr
            )
          : "Start rank unavailable",

      currentRank:
        formatValorantRank(
          player.tierName,
          player.rr
        ),

      scoreChange:
        Number.isFinite(
          player.scoreChange
        )
          ? player.scoreChange
          : null,

      wins: Number(
        player.wins || 0
      ),

      losses: Number(
        player.losses || 0
      ),

      draws: Number(
        player.draws || 0
      ),
    }))
    .sort((left, right) => {
      const leftGain =
        Number.isFinite(
          left.scoreChange
        )
          ? left.scoreChange
          : Number.NEGATIVE_INFINITY;

      const rightGain =
        Number.isFinite(
          right.scoreChange
        )
          ? right.scoreChange
          : Number.NEGATIVE_INFINITY;

      return rightGain - leftGain;
    });
}

async function loadLiveValorantLeaderboard() {
  leaderboardBody.replaceChildren();

  createLeaderboardEmptyRow(
    "Loading live Valorant standings…"
  );

  try {
    const response = await fetch(
      valorantLeaderboardUrl,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Valorant leaderboard request failed"
      );
    }

    const data =
      await response.json();

    liveValorantParticipants =
      mapLiveValorantParticipants(
        data.participants || []
      );

    if (
      selectedGame === "valorant"
    ) {
      renderLeaderboardRows(
        liveValorantParticipants,
        "valorant"
      );
    }
  } catch (error) {
    if (
      selectedGame === "valorant"
    ) {
      leaderboardBody.replaceChildren();

      createLeaderboardEmptyRow(
        "Live Valorant standings are temporarily unavailable. Please try again shortly."
      );
    }
  }
}

function renderLeaderboard(game) {
  selectedGame = game;

  const gameDetails = {
    league: {
      label:
        "League of Legends",
      participants:
        liveLeagueParticipants,
    },

    valorant: {
      label: "Valorant",
      participants:
        liveValorantParticipants,
    },
  };

  const currentGame =
    gameDetails[game] ||
    gameDetails.league;

  leaderboardTitle.textContent =
    `${currentGame.label} leaderboard`;

  gameTabs.forEach((tab) => {
    const isSelected =
      tab.dataset.game === game;

    tab.classList.toggle(
      "is-active",
      isSelected
    );

    tab.setAttribute(
      "aria-selected",
      String(isSelected)
    );
  });

  if (
    game === "league" &&
    !currentGame.participants
  ) {
    loadLiveLeagueLeaderboard();
    return;
  }

  if (
    game === "valorant" &&
    !currentGame.participants
  ) {
    loadLiveValorantLeaderboard();
    return;
  }

  renderLeaderboardRows(
    currentGame.participants,
    game
  );
}

function updateOpenEventState(
  now = new Date()
) {
  if (!openEvent) return;

  const phase = getPhase(
    openEvent,
    now
  );

  const details =
    getPhaseDetails(
      openEvent,
      phase
    );

  eventStatus.textContent =
    details.status;

  eventStatus.dataset.phase =
    phase;

  if (!details.target) return;

  countdownLabel.textContent =
    details.label;

  countdown.textContent =
    formatDuration(
      details.target.getTime() -
        now.getTime()
    );

  phaseMessage.textContent =
    details.message;
}

function showEvent(event) {
  openEvent = event;

  lastFocusedElement =
    document.activeElement;

  const dates =
    getEventDates(event);

  document.getElementById(
    "modal-event-icon"
  ).textContent =
    event.icon || "🐇";

  document.getElementById(
    "modal-event-eyebrow"
  ).textContent =
    event.eyebrow;

  document.getElementById(
    "modal-event-title"
  ).textContent =
    event.title;

  document.getElementById(
    "modal-event-intro"
  ).textContent =
    event.intro;

  const cozyNote =
    document.getElementById(
      "modal-cozy-note"
    );

  cozyNote.textContent =
    event.cozyNote || "";

  cozyNote.hidden =
    !event.cozyNote;

  rankedRaceContent.hidden =
    event.id !==
    rankedRaceEvent.id;

  ideaContent.hidden =
    event.id ===
    rankedRaceEvent.id;

  eventDatesList.hidden =
    !dates;

  countdownCard.hidden =
    !dates;

  timezoneLabel.hidden =
    !dates;

  if (dates) {
    document.getElementById(
      "signup-close-date"
    ).textContent =
      formatEventDate(
        event,
        dates.signupClose
      );

    document.getElementById(
      "event-start-date"
    ).textContent =
      formatEventDate(
        event,
        dates.start,
        false
      );

    document.getElementById(
      "event-end-date"
    ).textContent =
      formatEventDate(
        event,
        dates.end
      );
  }

  updateOpenEventState();

  eventModal.hidden = false;

  document.body.classList.add(
    "event-modal-open"
  );

  modalPanel.scrollTop = 0;
  modalPanel.focus();
}

function closeEvent() {
  if (eventModal.hidden) return;

  eventModal.hidden = true;

  document.body.classList.remove(
    "event-modal-open"
  );

  openEvent = null;

  if (
    lastFocusedElement?.isConnected
  ) {
    lastFocusedElement.focus();
  }
}

function refreshTimeSensitiveUI() {
  const now = new Date();

  const phaseSignature =
    communityEvents
      .map((event) =>
        getPhase(event, now)
      )
      .join("|");

  if (
    phaseSignature !==
    lastPhaseSignature
  ) {
    lastPhaseSignature =
      phaseSignature;

    renderEventCards(now);
    renderActiveEvents(now);
  }

  updateOpenEventState(now);
}

gameTabs.forEach((tab) => {
  tab.addEventListener(
    "click",
    () => {
      renderLeaderboard(
        tab.dataset.game
      );
    }
  );
});

document
  .querySelectorAll(
    "[data-close-event]"
  )
  .forEach((button) => {
    button.addEventListener(
      "click",
      closeEvent
    );
  });

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      closeEvent();
    }
  }
);

renderRules();
renderLeaderboard(selectedGame);
refreshTimeSensitiveUI();

window.setInterval(
  refreshTimeSensitiveUI,
  1000
);

const linkedEvent =
  communityEvents.find(
    (event) =>
      `#${event.id}` ===
      window.location.hash
  );

if (
  linkedEvent &&
  getPhase(linkedEvent) !==
    "archived"
) {
  showEvent(linkedEvent);
}