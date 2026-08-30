#!/usr/bin/env python3
"""Query the `links` table and plot link creation counts for the past 12 months as a PNG bar chart."""

import argparse
import os
import ssl
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs, urlparse

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pg8000.dbapi


def find_env_file(start: Path) -> Path | None:
    for directory in (start, *start.parents):
        for name in (".env.local", ".env"):
            candidate = directory / name
            if candidate.is_file():
                return candidate
    return None


def load_database_url() -> str:
    url = os.environ.get("DATABASE_URL")
    if url:
        return url

    env_path = find_env_file(Path.cwd())
    if env_path:
        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            if key.strip() == "DATABASE_URL":
                return value.strip().strip('"').strip("'")

    raise RuntimeError(
        "DATABASE_URL not found in the environment or a .env/.env.local file."
    )


def connect(database_url: str):
    parsed = urlparse(database_url)
    query = parse_qs(parsed.query)
    use_ssl = query.get("sslmode", ["require"])[0] != "disable"
    return pg8000.dbapi.connect(
        user=parsed.username,
        password=parsed.password,
        host=parsed.hostname,
        port=parsed.port or 5432,
        database=parsed.path.lstrip("/"),
        ssl_context=ssl.create_default_context() if use_ssl else None,
    )


def month_start(dt: datetime) -> datetime:
    return dt.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


def add_months(dt: datetime, months: int) -> datetime:
    month_index = dt.month - 1 + months
    year = dt.year + month_index // 12
    month = month_index % 12 + 1
    return dt.replace(year=year, month=month)


def past_12_months(reference: datetime) -> list[datetime]:
    start = month_start(reference)
    return [add_months(start, -offset) for offset in range(11, -1, -1)]


def fetch_counts(database_url: str, months: list[datetime]) -> dict[datetime, int]:
    range_start = months[0]
    conn = connect(database_url)
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT date_trunc('month', created_at) AS month, count(*)
            FROM links
            WHERE created_at >= %s
            GROUP BY 1
            ORDER BY 1;
            """,
            (range_start,),
        )
        rows = cur.fetchall()
    finally:
        conn.close()

    counts = {month: 0 for month in months}
    for month, count in rows:
        key = month.replace(tzinfo=None) if month.tzinfo else month
        if key in counts:
            counts[key] = count
    return counts


def plot(counts: dict[datetime, int], output_path: Path) -> None:
    months = sorted(counts)
    labels = [m.strftime("%b %Y") for m in months]
    values = [counts[m] for m in months]

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.bar(labels, values, color="#4f46e5")
    ax.set_xlabel("Month")
    ax.set_ylabel("Links created")
    ax.set_title("Links Created per Month (Last 12 Months)")
    ax.set_ylim(bottom=0)
    for i, v in enumerate(values):
        ax.text(i, v, str(v), ha="center", va="bottom")
    plt.xticks(rotation=45, ha="right")
    fig.tight_layout()

    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(output_path, dpi=150)
    plt.close(fig)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "-o",
        "--output",
        default="monthly-links.png",
        help="Path to write the PNG chart to (default: %(default)s)",
    )
    args = parser.parse_args()

    database_url = load_database_url()
    reference = datetime.now(timezone.utc).replace(tzinfo=None)
    months = past_12_months(reference)
    counts = fetch_counts(database_url, months)

    output_path = Path(args.output).resolve()
    plot(counts, output_path)

    print(f"Saved chart to {output_path}")
    for month in months:
        print(f"{month.strftime('%b %Y')}: {counts[month]}")


if __name__ == "__main__":
    main()
