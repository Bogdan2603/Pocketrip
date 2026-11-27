import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { Logo, Wallpaper } from "@/components/brand";
import { Faq } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { HeroPreview } from "@/components/landing/hero-preview";
import { Pricing } from "@/components/landing/pricing";
import { SiteHeader } from "@/components/landing/site-header";
import { Button } from "@/components/ui/button";

const STEPS = [
  { n: "01", title: "Citește", text: "bilete, rezervări și capturi de ecran" },
  { n: "02", title: "Extrage", text: "ore, adrese și coduri de rezervare" },
  { n: "03", title: "Calculează", text: "traseele dintre opriri, pe jos și cu mașina" },
  { n: "04", title: "Desenează", text: "traseul pe hartă", premium: true },
];

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="eyebrow mb-3 text-ink-3">{eyebrow}</p>
      <h2 className="text-[34px] leading-[1.05] text-ink sm:text-[44px]">{title}</h2>
      {text && <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{text}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Wallpaper opacity={0.06} />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-10 pb-24 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:pt-16">
          <div>
            <p className="eyebrow mb-5 text-highlight">Citește · Extrage · Organizează</p>
            <h1 className="text-[46px] leading-[0.98] tracking-[-0.04em] text-ink sm:text-[64px]">
              Toate biletele tale. <span className="text-highlight">O singură pagină.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
              Încarci documentele, iar Pocketrip îți organizează automat călătoria într-un program pe zile și ore, cu
              codurile la îndemână.
            </p>

            <ol className="mt-8 grid max-w-xl gap-x-6 gap-y-4 sm:grid-cols-2">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-3">
                  <span className="pt-0.5 font-mono text-[13px] font-semibold text-highlight">{s.n}</span>
                  <p className="leading-snug text-ink-2">
                    <b className="font-semibold text-ink">{s.title}</b> {s.text}
                    {s.premium && (
                      <span className="ml-1.5 rounded-full bg-route px-1.5 py-px align-[2px] font-mono text-[10px] text-white uppercase">
                        Premium
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Button asChild size="lg">
                <Link href="/autentificare?mod=cont-nou">
                  Încearcă gratuit <ArrowRight />
                </Link>
              </Button>
              <a href="#ce-primesti" className="squiggle font-semibold text-ink">
                Vezi ce primești
              </a>
            </div>
            <p className="mt-5 font-mono text-[12px] text-ink-3">
              Fără card · 3 generări pe zi gratuit · documentele nu se păstrează
            </p>
          </div>

          <HeroPreview />
        </section>

        {/* Ce primești */}
        <section id="ce-primesti" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <SectionTitle
              eyebrow="Ce găsești pe pagina ta"
              title="Un program, nu un dosar de PDF‑uri."
              text="Tot ce era împrăștiat prin e-mailuri și capturi ajunge într-o singură pagină, în ordinea în care se întâmplă."
            />
            <Features />
            <p className="mt-12 flex items-center gap-2.5 text-[15px] text-ink-2">
              <Lock className="size-4 text-highlight" />
              Documentele nu se păstrează: le citim și le ștergem imediat.
            </p>
          </div>
        </section>

        {/* Planuri */}
        <section id="planuri" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <SectionTitle
              eyebrow="Planuri"
              title="Plătești doar dacă pleci des."
              text="Începi gratuit. Treci pe Basic pentru PDF sau pe Premium pentru traseul desenat pe hartă."
            />
            <Pricing />
          </div>
        </section>

        {/* Întrebări */}
        <section id="intrebari" className="scroll-mt-20 border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
            <SectionTitle eyebrow="Întrebări" title="Ce ne întreabă lumea." />
            <Faq />
          </div>
        </section>

        {/* Final */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6">
            <h2 className="mx-auto max-w-3xl text-[38px] leading-[1.02] text-ink sm:text-[56px]">
              Data viitoare, la aeroport, ai totul pe o pagină.
            </h2>
            <p className="mt-4 font-hand text-[28px] text-highlight">fără căutat prin e-mailuri</p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/autentificare?mod=cont-nou">
                Creează cont gratuit <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-3">
            <Logo className="text-lg" />
            <span className="font-mono text-[12px] text-ink-3">© 2026</span>
          </div>
          <nav className="dot-sep flex items-center text-[15px] text-ink-2">
            <span>
              <a href="#" className="squiggle hover:text-ink">Termeni</a>
            </span>
            <span>
              <a href="#" className="squiggle hover:text-ink">Confidențialitate</a>
            </span>
            <span>
              <a href="mailto:contact@pocketrip.ro" className="squiggle hover:text-ink">Contact</a>
            </span>
          </nav>
        </div>
      </footer>
    </>
  );
}
