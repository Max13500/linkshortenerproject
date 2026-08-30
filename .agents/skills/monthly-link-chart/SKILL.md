---
name: monthly-link-chart
description: Generate a bar chart showing how many links were created per month over the past 12 months. Use this whenever the user asks for link creation stats, monthly link counts, a chart/graph/plot of link growth, or wants to visualize how many short links were created over time — even if they don't say "chart" explicitly (e.g. "how many links did we make each month this year").
compatibility: Requires the DATABASE_URL environment variable (Postgres/Neon connection string, normally read from the project's .env file) and a Python environment with pg8000 and matplotlib installed.
---

# Monthly Link Chart

Query the `links` table and plot a bar chart of links created per month for the past 12 months, exported as a PNG.

## How it works

1. The bundled script [scripts/plot_monthly_links.py](./scripts/plot_monthly_links.py) reads `DATABASE_URL` from the environment, falling back to the nearest `.env`/`.env.local` file found by walking up from the current directory.
2. It connects to Postgres with `pg8000` (a pure-Python driver — no compiled/binary dependency, so it works reliably across Python versions).
3. It queries `links.created_at`, grouped by calendar month, for the 12 months ending with the current month — including months with zero links so the x axis always has 12 bars.
4. It renders the result with `matplotlib` as a bar chart (x axis = month labels like "Aug 2025", y axis = link count) and saves it as a PNG.

## Running it

```
C:/Python314/python.exe .agents/skills/monthly-link-chart/scripts/plot_monthly_links.py --output monthly-links.png
```

- `--output` (optional): path to write the PNG to. Defaults to `monthly-links.png` in the current directory.
- Never print, log, or echo the `DATABASE_URL` value in chat or terminal output — it contains database credentials.

## Dependencies

If `pg8000` or `matplotlib` are missing, install them with:

```
C:/Python314/python.exe -m pip install pg8000 matplotlib
```
