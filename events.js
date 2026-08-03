import { rankedRaceEvent } from "./event-config.js";

const eventDates = {
  start: new Date(rankedRaceEvent.startAt),
  signupClose: new Date(rankedRaceEvent.signupClosesAt),
  end: new Date(rankedRaceEvent.endAt),
  archive: new Date(rankedRaceEvent.archiveAt),
};

const activeEvent = document.getElementById("active-event");
const archivedEvent = document.getElementById("archived-event");
const eventStatus = document.getElementById("event-status");
const countdown = document.getElementById("countdown");
const countdownLabel = document.getElementById("countdown-label");
const phaseMessage = document.getElementById("phase-message");
const leaderboardTitle = document.getElementById("leaderboard-title");
const leaderboardBody = document.getElementById("leaderboard-body");
const gameTabs = Array.from(document.querySelectorAll("[data-game]"));

let selectedGame = "league";
let countdownTimer;

function formatEventDate(date, includeTime = true) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: rankedRaceEvent.timeZone,
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit", hourCycle: "h23" } : {}),
  }).format(date);
}

function setDateLabels() {
  document.getElementById("event-start-date").textContent = formatEventDate(eventDates.start, false);
  document.getElementById("signup-close-date").textContent = formatEventDate(eventDates.signupClose);
  document.getElementById("event-end-date").textContent = formatEventDate(eventDates.end);
}

function getPhase(now) {
  if (now < eventDates.start) return "upcoming";
  if (now <= eventDates.signupClose) return "registration";
  if (now <= eventDates.end) return "live";
  if (now < eventDates.archive) return "ended";
  return "archived";
}

function getPhaseDetails(phase) {
  const phases = {
    upcoming: {
      status: "Starting soon",
      label: "Challenge starts in",
      message: "Prepare your main account before registration opens.",
      target: eventDates.start,
    },
    registration: {
      status: "Registration open",
      label: "Registration closes in",
      message: "Submit your main account in the JailRabbit Discord for approval.",
      target: eventDates.signupClose,
    },
    live: {
      status: "Challenge live",
      label: "Challenge ends in",
      message: "Registration is closed. Follow each approved player's progress below.",
      target: eventDates.end,
    },
    ended: {
      status: "Final results",
      label: "Event page archives in",
      message: "The challenge is over. Final standings remain visible for one week.",
      target: eventDates.archive,
    },
  };

  return phases[phase];
}

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function updateEventState() {
  const now = new Date();
  const phase = getPhase(now);

  if (phase === "archived") {
    activeEvent.hidden = true;
    archivedEvent.hidden = false;
    if (countdownTimer) window.clearInterval(countdownTimer);
    return;
  }

  activeEvent.hidden = false;
  archivedEvent.hidden = true;

  const details = getPhaseDetails(phase);
  eventStatus.textContent = details.status;
  eventStatus.dataset.phase = phase;
  countdownLabel.textContent = details.label;
  countdown.textContent = formatDuration(details.target.getTime() - now.getTime());
  phaseMessage.textContent = details.message;
}

function createPlayerCell(player) {
  const cell = document.createElement("td");
  const name = document.createElement(player.profileUrl ? "a" : "span");
  name.className = "player-name";
  name.textContent = player.displayName;

  if (player.profileUrl) {
    name.href = player.profileUrl;
    name.target = "_blank";
    name.rel = "noopener noreferrer";
  }

  const account = document.createElement("span");
  account.className = "player-account";
  account.textContent = player.account;

  cell.append(name, account);
  return cell;
}

function createTextCell(value, className = "") {
  const cell = document.createElement("td");
  cell.textContent = value;
  if (className) cell.className = className;
  return cell;
}

function renderLeaderboard(game) {
  selectedGame = game;
  const label = game === "league" ? "League of Legends" : "Valorant";
  const participants = [...rankedRaceEvent.participants[game]].sort(
    (first, second) => second.scoreChange - first.scoreChange,
  );

  leaderboardTitle.textContent = `${label} leaderboard`;
  leaderboardBody.replaceChildren();

  gameTabs.forEach((tab) => {
    const isSelected = tab.dataset.game === game;
    tab.classList.toggle("is-active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
  });

  if (participants.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.className = "leaderboard-empty";
    cell.colSpan = 6;
    cell.textContent = `Approved ${label} competitors will appear here.`;
    row.append(cell);
    leaderboardBody.append(row);
    return;
  }

  participants.forEach((player, index) => {
    const row = document.createElement("tr");
    const result = `${player.wins ?? 0} / ${player.losses ?? 0} / ${player.draws ?? 0}`;
    const gainPrefix = player.scoreChange > 0 ? "+" : "";

    row.append(
      createTextCell(`#${index + 1}`, "place-cell"),
      createPlayerCell(player),
      createTextCell(player.startRank),
      createTextCell(player.currentRank),
      createTextCell(`${gainPrefix}${player.scoreChange}`, player.scoreChange >= 0 ? "score-positive" : "score-negative"),
      createTextCell(result),
    );

    leaderboardBody.append(row);
  });
}

gameTabs.forEach((tab) => {
  tab.addEventListener("click", () => renderLeaderboard(tab.dataset.game));
});

setDateLabels();
renderLeaderboard(selectedGame);
updateEventState();
countdownTimer = window.setInterval(updateEventState, 1000);
