"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader } from "./dialog";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  tone = "danger",
  pending,
  onConfirm,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel: string;
  tone?: "danger" | "primary";
  pending?: boolean;
  onConfirm: () => void;
  children?: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader title={title} description={description} />
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Renunță</Button>
          </DialogClose>
          <Button variant={tone} onClick={onConfirm} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
