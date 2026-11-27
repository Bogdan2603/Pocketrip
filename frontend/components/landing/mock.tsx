import { Car, Copy, Footprints, Hotel, Landmark, Plane, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

// Piese de ilustrație pentru pagina de prezentare: arată cum va arăta programul.

export type Category = "flight" | "stay" | "food" | "sight";
export type Status = "ok" | "wait" | "bad";

const CATEGORY = {
  flight: { icon: Plane, className: "bg-cat-flight/12 text-cat-flight", label: "Zbor" },
  stay: { icon: Hotel, className: "bg-cat-stay/12 text-cat-stay", label: "Cazare" },
  food: { icon: UtensilsCrossed, className: "bg-cat-food/14 text-cat-food", label: "Restaurant" },
  sight: { icon: Landmark, className: "bg-cat-sight/12 text-cat-sight", label: "Obiectiv" },
} as const;

const STATUS = {
  ok: { label: "Confirmat", className: "text-ok bg-ok/10" },
  wait: { label: "În așteptare", className: "text-wait bg-wait/12" },
  bad: { label: "De verificat", className: "text-bad bg-bad/10" },
} as const;

export function StopRow({
  time,
  end,
  category,
  title,
  address,
  status,
  code,
  active,
  className,
}: {
  time: string;
  end?: string;
  category: Category;
  title: string;
  address: string;
  status: Status;
  code?: string;
  active?: boolean;
  className?: string;
}) {
  const cat = CATEGORY[category];
  const Icon = cat.icon;
  const st = STATUS[status];
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border bg-white p-3 transition-colors",
        active ? "border-sun ring-2 ring-sun/40" : "border-sheet-line",
        className,
      )}
    >
      <div className="w-[46px] shrink-0 pt-0.5 font-mono text-[13px] leading-tight font-semibold text-route">
        {time}
        {end && <span className="block text-[11px] font-normal text-sheet-muted">{end}</span>}
      </div>
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg [&_svg]:size-4", cat.className)}>
        <Icon />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] tracking-[0.12em] text-sheet-muted uppercase">{cat.label}</p>
        <p className="truncate leading-snug font-bold">{title}</p>
        <p className="truncate text-[13px] text-sheet-muted">{address}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className={cn("rounded-full px-2 py-px font-mono text-[10px] font-medium uppercase", st.className)}>
            {st.label}
          </span>
          {code && (
            <span className="inline-flex items-center gap-1 rounded-md bg-sheet-soft px-1.5 py-px font-mono text-[11px] text-sheet-ink">
              {code}
              <Copy className="size-3 text-sheet-muted" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function TravelRow({ mode, text, alt }: { mode: "walk" | "car"; text: string; alt?: string }) {
  const Icon = mode === "walk" ? Footprints : Car;
  return (
    <div className="flex items-stretch gap-3 px-3">
      <div className="w-[46px] shrink-0" />
      <div className="flex w-8 shrink-0 justify-center">
        <span className="min-h-9 border-l-2 border-dotted border-route/45" />
      </div>
      <div className="flex min-w-0 items-center gap-2 py-1.5">
        <Icon className="size-3.5 shrink-0 text-route" />
        <span className="font-hand text-[18px] leading-none whitespace-nowrap text-sheet-ink">{text}</span>
        {alt && <span className="hidden truncate text-[12px] text-sheet-muted sm:inline">· {alt}</span>}
      </div>
    </div>
  );
}

export function MiniMap({ className, active = 2 }: { className?: string; active?: number }) {
  const pins = [
    { n: 1, x: 62, y: 70 },
    { n: 2, x: 190, y: 128 },
    { n: 3, x: 150, y: 200 },
  ];
  return (
    <svg viewBox="0 0 260 250" preserveAspectRatio="xMidYMid slice" className={cn("block h-auto w-full", className)} role="img" aria-label="Traseul zilei pe hartă">
      <rect width="260" height="250" fill="#EAF0E6" />
      {/* râul */}
      <path d="M0 150 C40 140 70 170 100 160 S160 110 170 60 S210 10 260 20" fill="none" stroke="#BFD6EE" strokeWidth="14" strokeLinecap="round" />
      {/* parc */}
      <rect x="18" y="160" width="56" height="44" rx="10" fill="#D5E6C9" />
      {/* străzi */}
      <g stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M0 100 H260" />
        <path d="M120 0 V250" />
        <path d="M0 230 L260 180" />
        <path d="M30 0 L90 250" />
        <path d="M200 0 L230 250" />
      </g>
      {/* traseul */}
      <path
        d={`M${pins[0].x} ${pins[0].y} Q 130 80 ${pins[1].x} ${pins[1].y} T ${pins[2].x} ${pins[2].y}`}
        fill="none"
        stroke="#1F4FB5"
        strokeWidth="3"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      <g fontFamily="var(--font-plex-mono)" fontSize="10" fontWeight="600">
        <rect x="112" y="78" width="50" height="17" rx="8.5" fill="#fff" stroke="#E3E6EE" />
        <text x="137" y="90" textAnchor="middle" fill="#1F4FB5">22 min</text>
        <rect x="178" y="160" width="44" height="17" rx="8.5" fill="#fff" stroke="#E3E6EE" />
        <text x="200" y="172" textAnchor="middle" fill="#1F4FB5">9 min</text>
      </g>
      {pins.map((p) => {
        const on = p.n === active;
        return (
          <g key={p.n} transform={`translate(${p.x} ${p.y})`}>
            <path
              d={on ? "M0 0 C-14 -16 -14 -34 0 -34 C14 -34 14 -16 0 0Z" : "M0 0 C-11 -12 -11 -27 0 -27 C11 -27 11 -12 0 0Z"}
              fill={on ? "#E8C547" : "#1F4FB5"}
              stroke="#fff"
              strokeWidth="2"
            />
            <text
              y={on ? -19 : -15}
              textAnchor="middle"
              fontFamily="var(--font-plex-mono)"
              fontSize={on ? 12 : 10}
              fontWeight="700"
              fill={on ? "#111" : "#fff"}
            >
              {p.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
