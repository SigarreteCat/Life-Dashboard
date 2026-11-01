"use client";

import { useEffect, useState } from "react";
import { Card } from "./Card";
import { useStoredState } from "@/lib/storage";

type Place = { name: string; lat: number; lon: number };
type Forecast = {
  current: { temperature_2m: number; apparent_temperature: number; weather_code: number; wind_speed_10m: number };
  daily: { time: string[]; temperature_2m_max: number[]; temperature_2m_min: number[]; weather_code: number[] };
};

// WMO weather codes used by Open-Meteo
function describe(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  return "Thunderstorm";
}

function icon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 67 || (code >= 80 && code <= 82)) return "🌧️";
  if (code <= 86) return "❄️";
  return "⛈️";
}

export function Weather() {
  const [place, setPlace] = useStoredState<Place | null>("weather-place", null);
  const [unit, setUnit] = useStoredState<"fahrenheit" | "celsius">("weather-unit", "fahrenheit");
  const [data, setData] = useState<Forecast | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!place) return;
    const ctrl = new AbortController();
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}` +
      `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=5&timezone=auto` +
      `&temperature_unit=${unit}&wind_speed_unit=${unit === "fahrenheit" ? "mph" : "kmh"}`;
    setError("");
    fetch(url, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(setData)
      .catch((e) => {
        if (e.name !== "AbortError") setError("Couldn't load the forecast.");
      });
    return () => ctrl.abort();
  }, [place, unit]);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    try {
      const r = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?count=1&name=${encodeURIComponent(query.trim())}`,
      );
      const j = await r.json();
      const hit = j.results?.[0];
      if (!hit) setError(`No place called "${query}".`);
      else {
        setPlace({ name: [hit.name, hit.admin1 ?? hit.country].filter(Boolean).join(", "), lat: hit.latitude, lon: hit.longitude });
        setQuery("");
      }
    } catch {
      setError("Search failed.");
    }
    setSearching(false);
  }

  function useMyLocation() {
    if (!navigator.geolocation) return setError("Location isn't available in this browser.");
    navigator.geolocation.getCurrentPosition(
      (p) => setPlace({ name: "My location", lat: p.coords.latitude, lon: p.coords.longitude }),
      () => setError("Location permission was denied."),
    );
  }

  const sym = unit === "fahrenheit" ? "°F" : "°C";

  return (
    <Card
      title={place ? `Weather · ${place.name}` : "Weather"}
      action={
        place && (
          <div className="flex gap-2 text-xs">
            <button className="text-muted hover:text-ink" onClick={() => setUnit(unit === "fahrenheit" ? "celsius" : "fahrenheit")}>
              {unit === "fahrenheit" ? "°C" : "°F"}
            </button>
            <button className="text-muted hover:text-ink" onClick={() => { setPlace(null); setData(null); }}>
              change
            </button>
          </div>
        )
      }
    >
      {!place ? (
        <div className="space-y-3">
          <form onSubmit={search} className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a city"
              className="min-w-0 flex-1 rounded-lg border border-line bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button disabled={searching} className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white disabled:opacity-60">
              Set
            </button>
          </form>
          <button onClick={useMyLocation} className="text-sm text-accent">or use my location</button>
        </div>
      ) : data ? (
        <div>
          <div className="flex items-center gap-4">
            <span className="text-5xl" aria-hidden>{icon(data.current.weather_code)}</span>
            <div>
              <p className="text-4xl font-semibold tabular-nums">{Math.round(data.current.temperature_2m)}{sym}</p>
              <p className="text-sm text-muted">
                {describe(data.current.weather_code)} · feels {Math.round(data.current.apparent_temperature)}° · wind{" "}
                {Math.round(data.current.wind_speed_10m)} {unit === "fahrenheit" ? "mph" : "km/h"}
              </p>
            </div>
          </div>
          <ul className="mt-5 grid grid-cols-5 gap-1 text-center text-sm">
            {data.daily.time.map((t, i) => (
              <li key={t} className="rounded-lg py-2">
                <p className="text-xs text-muted">
                  {i === 0 ? "Today" : new Date(t + "T12:00").toLocaleDateString(undefined, { weekday: "short" })}
                </p>
                <p className="my-1 text-xl" title={describe(data.daily.weather_code[i])}>{icon(data.daily.weather_code[i])}</p>
                <p className="tabular-nums">
                  {Math.round(data.daily.temperature_2m_max[i])}°
                  <span className="text-muted"> {Math.round(data.daily.temperature_2m_min[i])}°</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !error && <p className="text-sm text-muted">Loading…</p>
      )}
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </Card>
  );
}
