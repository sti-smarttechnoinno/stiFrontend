"use client";

import { ReactNode } from "react";
import { LocaleProvider } from "./locale-context";
import { PreferencesProvider } from "./preferences-context";

export default function Providers({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  return (
    <LocaleProvider locale={locale}>
      <PreferencesProvider locale={locale}>
        {children}
      </PreferencesProvider>
    </LocaleProvider>
  );
}