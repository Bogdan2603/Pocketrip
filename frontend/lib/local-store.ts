"use client";

import { useSyncExternalStore } from "react";

/**
 * O valoare din localStorage citită prin useSyncExternalStore, ca să nu avem
 * erori de hidratare: pe server (și la hidratare) valoarea e `undefined`.
 */
export function createLocalStore(key: string) {
  const listeners = new Set<() => void>();

  const read = (): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const subscribe = (callback: () => void) => {
    listeners.add(callback);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) callback();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(callback);
      window.removeEventListener("storage", onStorage);
    };
  };

  const write = (value: string | null) => {
    try {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
    } catch {
      // stocare indisponibilă (mod privat): păstrăm doar în memorie pe durata paginii
    }
    listeners.forEach((listener) => listener());
  };

  const useValue = () => useSyncExternalStore<string | null | undefined>(subscribe, read, () => undefined);

  return { read, write, useValue };
}
