"use client";

import { useRef } from "react";

type noop = (...args: any[]) => any;

export function usePersistFn<T extends noop>(fn: T): T {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<T | null>(null);
  if (!persistFn.current) {
    persistFn.current = function (this: unknown, ...args: any[]) {
      return fnRef.current!.apply(this, args);
    } as T;
  }

  return persistFn.current;
}
