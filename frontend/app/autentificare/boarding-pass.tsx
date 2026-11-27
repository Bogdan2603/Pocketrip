import { Plane } from "lucide-react";

/** Bilet de îmbarcare cu o pagină de program dedesubt (ilustrație). */
export function BoardingPass() {
  return (
    <div className="relative mt-10 max-w-md">
      {/* pagina de program, dedesubt */}
      <div className="sheet absolute inset-x-6 -bottom-6 h-24 opacity-70" aria-hidden />
      <div className="sheet relative flex overflow-hidden">
        <div className="flex-1 p-5">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-sheet-muted">Boarding pass</span>
            <span className="font-mono text-[12px] font-semibold text-route">W6 3341</span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-[34px] leading-none font-extrabold tracking-tight">SCV</p>
              <p className="mt-1 text-[13px] text-sheet-muted">Suceava</p>
            </div>
            <div className="flex flex-1 items-center gap-2 text-route">
              <span className="h-px flex-1 border-t-2 border-dotted border-route/40" />
              <Plane className="size-5" />
              <span className="h-px flex-1 border-t-2 border-dotted border-route/40" />
            </div>
            <div className="text-right">
              <p className="font-display text-[34px] leading-none font-extrabold tracking-tight">FCO</p>
              <p className="mt-1 text-[13px] text-sheet-muted">Roma</p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-dashed border-sheet-line pt-4 font-mono text-[12px]">
            <div>
              <dt className="text-sheet-muted">DATA</dt>
              <dd className="font-semibold">12 MAR</dd>
            </div>
            <div>
              <dt className="text-sheet-muted">ATERIZARE</dt>
              <dd className="font-semibold">14:00</dd>
            </div>
            <div>
              <dt className="text-sheet-muted">LOC</dt>
              <dd className="font-semibold">14C</dd>
            </div>
          </dl>
        </div>
        {/* cotorul, cu perforație */}
        <div className="relative flex w-24 flex-col items-center justify-center gap-2 border-l-2 border-dashed border-sheet-line bg-sun/90 px-2">
          <span className="absolute -top-3 -left-3 size-6 rounded-full bg-desk" />
          <span className="absolute -bottom-3 -left-3 size-6 rounded-full bg-desk" />
          <span className="font-mono text-[10px] tracking-widest text-[#111]/70">POARTA</span>
          <span className="font-display text-3xl font-extrabold">B7</span>
          <span className="font-hand text-[17px] leading-none text-[#111]/80">la timp!</span>
        </div>
      </div>
    </div>
  );
}
