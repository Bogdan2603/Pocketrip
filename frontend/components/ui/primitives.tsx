"use client";

import { ChevronDown } from "lucide-react";
import { Accordion as AccordionPrimitive, DropdownMenu as MenuPrimitive, Switch as SwitchPrimitive, Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/* ---------- Tabs ---------- */

export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("inline-flex items-center gap-1 rounded-xl bg-[#111]/[0.06] p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-[15px] font-semibold text-current/60 transition-all hover:text-current data-[state=active]:bg-white data-[state=active]:text-[#111] data-[state=active]:shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_rgb(0_0_0/0.04)] [&_svg]:size-4",
        className,
      )}
      {...props}
    />
  );
}

/* ---------- Accordion ---------- */

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-sheet-line last:border-b-0", className)} {...props} />;
}

export function AccordionTrigger({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 cursor-pointer items-center justify-between gap-4 py-5 text-left font-display text-[17px] font-bold tracking-tight transition-colors hover:text-route",
          className,
        )}
        {...props}
      >
        {children}
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sheet-soft transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:bg-sun">
          <ChevronDown className="size-4" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden text-[15px] leading-relaxed text-sheet-muted data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-5 pr-12", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

/* ---------- Dropdown ---------- */

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;

export function DropdownMenuContent({ className, sideOffset = 8, ...props }: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "sheet z-50 min-w-56 p-1.5 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({ className, ...props }: ComponentProps<typeof MenuPrimitive.Item>) {
  return (
    <MenuPrimitive.Item
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[15px] outline-none select-none data-[highlighted]:bg-sheet-soft [&_svg]:size-4 [&_svg]:text-sheet-muted",
        className,
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator() {
  return <MenuPrimitive.Separator className="my-1.5 h-px bg-sheet-line" />;
}

export const DropdownMenuLabel = MenuPrimitive.Label;

/* ---------- Switch ---------- */

export function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-[#111]/15 transition-colors data-[state=checked]:bg-route",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[22px]" />
    </SwitchPrimitive.Root>
  );
}
