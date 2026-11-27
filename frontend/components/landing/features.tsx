import { FileDown } from "lucide-react";
import { MiniMap, StopRow, TravelRow } from "./mock";

const POINTS = [
  { title: "Programul pe ore", text: "Fiecare zi, cu opririle în ordine și deplasările dintre ele: cât faci pe jos și cât cu mașina." },
  { title: "Codurile, lângă fiecare oprire", text: "Codul de rezervare stă lângă bilet, cu buton de copiere. Nu mai cauți prin e-mailuri la poartă." },
  { title: "Traseul pe hartă", text: "Pinii numerotați în ordinea zilei, legați printr-o linie, cu durata pe fiecare porțiune.", tag: "Premium" },
  { title: "Export PDF", text: "Tot programul pe hârtie sau offline în telefon, pentru când nu ai semnal.", tag: "Basic și Premium" },
];

function Marker({ n, className }: { n: number; className: string }) {
  return (
    <span
      className={`absolute z-10 grid size-7 place-items-center rounded-full bg-sun font-mono text-[13px] font-bold text-[#111] shadow-[0_0_0_4px_rgb(232_197_71/0.3)] ${className}`}
    >
      {n}
    </span>
  );
}

export function Features() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr]">
      <div className="relative">
        <div className="sheet grid overflow-hidden sm:grid-cols-[1.25fr_1fr]">
          <div className="relative p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-extrabold tracking-tight">Ziua 1 · joi, 12 mar</p>
              <span className="relative inline-flex h-8 items-center gap-1.5 rounded-lg bg-sun px-3 text-[13px] font-semibold">
                <FileDown className="size-3.5" /> PDF
                <Marker n={4} className="-top-4 -right-4" />
              </span>
            </div>
            <div className="relative">
              <Marker n={1} className="top-1 -left-2" />
              <StopRow time="14:00" category="flight" title="Zbor SCV → FCO" address="Aeroportul Fiumicino, T3" status="ok" code="W6 3341" />
            </div>
            <TravelRow mode="car" text="35 min cu mașina · 31 km" />
            <div className="relative">
              <StopRow time="15:30" category="stay" title="Hotel Campo" address="Via dei Giubbonari, 4" status="ok" code="HC-20931" />
              <Marker n={2} className="right-6 -bottom-2" />
            </div>
            <TravelRow mode="walk" text="12 min pe jos · 900 m" />
            <StopRow time="20:30" category="food" title="Trattoria da Luigi" address="Piazza Sforza Cesarini, 23" status="bad" />
          </div>
          <div className="relative flex items-center border-t border-sheet-line bg-[#EAF0E6] sm:border-t-0 sm:border-l">
            <MiniMap active={2} />
            <Marker n={3} className="top-4 left-4" />
          </div>
        </div>
      </div>

      <ol className="grid gap-6">
        {POINTS.map((p, i) => (
          <li key={p.title} className="flex gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sun font-mono text-sm font-bold text-[#111]">
              {i + 1}
            </span>
            <div>
              <h3 className="flex flex-wrap items-center gap-2 text-lg text-ink">
                {p.title}
                {p.tag && (
                  <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-ink-2 uppercase">
                    {p.tag}
                  </span>
                )}
              </h3>
              <p className="mt-1 leading-relaxed text-ink-2">{p.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
