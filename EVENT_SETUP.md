# JailRabbit events setup

Event cards, dates, rules and participant lists are stored in `event-config.js`.
The `communityEvents` list controls which cards appear on `/events`.

The three cards marked `Event idea` are safe placeholders. Edit or remove them
when a real event is ready. Events with dates automatically appear in the green
active-event bar while registration is open, while they are starting soon and
while they are live.

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

- Registration closes: 5 August 2026 at 23:59, Europe/Oslo
- Event start: 7 August 2026 at 00:00, Europe/Oslo
- Event ends: 4 September 2026 at 23:59, Europe/Oslo
- The event is automatically hidden: 12 September 2026 at 00:00, Europe/Oslo

Change these values only in the date section at the top of `event-config.js`.
