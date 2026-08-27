"use client";

import { useLocale } from "./locale-context";
import en from '@/messages/en.json';
import fr from '@/messages/fr.json';
import ar from '@/messages/ar.json';

const dictionaries = { en, fr, ar };

export function useTranslations() {
  const { locale } = useLocale();
  const dict = dictionaries[locale as keyof typeof dictionaries] || dictionaries.en;
  return dict;
}