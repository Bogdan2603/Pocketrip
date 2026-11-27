"use client";

import { Check, FileImage, FileText } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { MiniMap, StopRow, TravelRow } from "./mock";

const FILES = [
  { name: "bilet-avion-roma.pdf", icon: FileText },
  { name: "confirmare-cazare.pdf", icon: FileText },
  { name: "bilet-vatican.jpg", icon: FileImage },
];

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[540px] lg:mr-0">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sheet overflow-hidden"
      >
        {/* bara „fișiere citite automat” */}
        <div className="border-b border-sheet-line bg-sheet-soft px-4 py-3">
          <p className="eyebrow mb-2 text-sheet-muted">3 fișiere · citite automat</p>
          <motion.ul variants={list} initial="hidden" animate="show" className="flex flex-wrap gap-1.5">
            {FILES.map((f) => (
              <motion.li
                key={f.name}
                variants={item}
                className="inline-flex items-center gap-1.5 rounded-md border border-sheet-line bg-white px-2 py-1 text-[12px]"
              >
                <f.icon className="size-3.5 text-route" />
                <span className="max-w-[140px] truncate font-mono">{f.name}</span>
                <Check className="size-3.5 text-ok" strokeWidth={3} />
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="eyebrow text-sheet-muted">Roma, 3 zile</p>
              <p className="font-display text-xl font-extrabold tracking-tight">Ziua 2 · vin., 13 mar</p>
            </div>
            <div className="flex gap-1 rounded-lg bg-sheet-soft p-1 font-mono text-[11px] font-semibold">
              <span className="rounded-md px-2 py-1 text-sheet-muted">Z1</span>
              <span className="rounded-md bg-white px-2 py-1 shadow-sm">Z2</span>
              <span className="rounded-md px-2 py-1 text-sheet-muted">Z3</span>
            </div>
          </div>

          <motion.div variants={list} initial="hidden" animate="show">
            <motion.div variants={item}>
              <StopRow time="09:00" end="12:00" category="sight" title="Muzeele Vaticanului" address="Viale Vaticano, 00165" status="ok" code="VAT-48213" />
            </motion.div>
            <motion.div variants={item}>
              <TravelRow mode="walk" text="22 min pe jos · 1,6 km" alt="sau 9 min cu mașina" />
            </motion.div>
            <motion.div variants={item}>
              <StopRow time="13:30" end="16:00" category="sight" title="Colosseum" address="Piazza del Colosseo, 1" status="wait" code="COL-7781" active />
            </motion.div>
            <motion.div variants={item}>
              <TravelRow mode="car" text="9 min cu mașina · 3,1 km" alt="sau 38 min pe jos" />
            </motion.div>
            <motion.div variants={item}>
              <StopRow time="20:00" category="food" title="Cină la Da Enzo" address="Via dei Vascellari, 29" status="bad" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* harta mică, peste colțul foii */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="sheet absolute -right-3 -bottom-10 hidden w-[180px] overflow-hidden p-1.5 sm:block lg:-right-8"
      >
        <MiniMap className="rounded-[9px]" />
        <p className="flex items-center justify-between px-1.5 pt-1.5 pb-0.5 font-mono text-[10px] text-sheet-muted">
          <span>3 opriri</span>
          <span className="rounded-full bg-route px-1.5 text-white">Premium</span>
        </p>
      </motion.div>
    </div>
  );
}
