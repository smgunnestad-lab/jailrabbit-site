# Ranked Race setup

The event dates and participant lists are stored in `event-config.js`.

## Add a League player

Add an object inside `participants.league`:

```js
{
  displayName: "Discord name",
  account: "GameName#Tag",
  profileUrl: "https://op.gg/lol/summoners/euw/GameName-Tag",
  startRank: "Silver II, 40 LP",
  currentRank: "Silver I, 12 LP",
  scoreChange: 72,
  wins: 8,
  losses: 5,
  draws: 0,
},
```

## Add a Valorant player

Add the same type of object inside `participants.valorant`. Use RR in the rank
labels and a Tracker profile URL if one is available.

## Important

The current version displays and sorts the values from `event-config.js`. It does
not contact Riot or Tracker yet, so rank, score, wins and losses must be updated
manually until a backend tracking option has been selected.

API keys must never be added to `event-config.js`, `events.js` or any other file
that is sent to the browser.

## Automatic dates

- Event start: 3 August 2026 at 00:00, Europe/Oslo
- Registration closes: 5 August 2026 at 23:59, Europe/Oslo
- Event ends: 1 September 2026 at 23:59, Europe/Oslo
- The event is automatically hidden: 9 September 2026 at 00:00, Europe/Oslo

Change these values only in the date section at the top of `event-config.js`.
