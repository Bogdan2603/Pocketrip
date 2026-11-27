"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/primitives";

const QUESTIONS = [
  {
    q: "Ce documente pot încărca?",
    a: "Bilete de avion și tren, confirmări de cazare, rezervări la restaurante și bilete la muzee: PDF-uri, poze (JPG) sau capturi de ecran (PNG). Pocketrip scoate din ele orele, adresele și codurile de rezervare.",
  },
  {
    q: "Se păstrează fișierele mele?",
    a: "Nu. Le citim, extragem ce ne trebuie pentru program și le ștergem imediat. În cont rămâne doar programul generat.",
  },
  {
    q: "Ce se întâmplă dacă un document nu se citește bine?",
    a: "Oprirea respectivă apare marcată „De verificat”. Confirmi că e corectă sau o corectezi tu, iar traseele se recalculează. O generare eșuată nu se scade din generările tale.",
  },
  {
    q: "Pot muta un pin pe hartă?",
    a: "Da, în planul Premium tragi pinul unde trebuie și locația se corectează. Poți schimba și ordinea opririlor din program, iar linia de pe hartă se actualizează.",
  },
];

export function Faq() {
  return (
    <Accordion type="single" collapsible className="sheet px-6 sm:px-8">
      {QUESTIONS.map((item, i) => (
        <AccordionItem key={i} value={`q${i}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
