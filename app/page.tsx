import { Greeting } from "@/components/Greeting";
import { Weather } from "@/components/Weather";
import { Focus } from "@/components/Focus";
import { Habits } from "@/components/Habits";
import { Mood } from "@/components/Mood";
import { Notes } from "@/components/Notes";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Greeting />
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Weather />
        <Focus />
        <Mood />
        <Habits className="lg:col-span-2" />
        <Notes />
      </div>
      <footer className="mt-10 text-center text-xs text-muted">
        Your entries are saved in this browser only. Weather by Open-Meteo.
      </footer>
    </main>
  );
}
