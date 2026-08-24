"use client";

import { ReactNode } from "react";
import { LocaleProvider } from "./locale-context";
import { PreferencesProvider } from "./preferences-context";
import StoreProvider, { type InitialData } from "../lib/store/StoreProvider";

export default function Providers({
  locale,
  initialData,
  children,
}: {
  locale: string;
  initialData?: InitialData;
  children: ReactNode;
}) {
  return (
    <StoreProvider initialData={initialData}>
      <LocaleProvider locale={locale}>
        <PreferencesProvider locale={locale}>
          {children}
        </PreferencesProvider>
      </LocaleProvider>
    </StoreProvider>
  );
}