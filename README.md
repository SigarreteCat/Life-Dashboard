# Life Dashboard

My day at a glance: weather, today's focus, habits, mood, and notes.

Built with Next.js, React and Tailwind CSS. No accounts or API keys needed yet.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## What's in it

| Tile | What it does | Data |
|---|---|---|
| Greeting | Time-of-day greeting, date and clock | — |
| Weather | Current conditions + 5-day forecast for a city or your location | [Open-Meteo](https://open-meteo.com) (free, no key) |
| Today's focus | Simple to-do list | This browser |
| Habits | 7-day check grid with streaks | This browser |
| Mood | Daily mood check-in + 14-day chart | This browser |
| Notes | Auto-saving scratchpad | This browser |

Entries are saved in your browser's localStorage, so they stay on that device only.
A cloud database (e.g. Supabase) can be added later to sync across devices.

## Project layout

```
app/          page, layout, global styles
components/   one file per tile
lib/          storage hook and date helpers
```

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com) — no settings needed.
