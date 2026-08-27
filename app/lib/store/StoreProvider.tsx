"use client";

import { useRef, ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";
import { setSolutions } from "./features/solutionsSlice";
import { setProducts } from "./features/productsSlice";
import { setNews, setFeaturedArticleId } from "./features/newsSlice";
import type { ApiSolutionItem } from '@/app/data/solutions-server';
import type { ApiProductItem } from '@/app/data/products-server';
import type { NewsArticle } from '@/app/data/news-articles';

export interface InitialData {
  solutions?: ApiSolutionItem[];
  products?: ApiProductItem[];
  news?: NewsArticle[];
  featuredArticleId?: string | number | null;
}

export default function StoreProvider({
  initialData,
  children,
}: {
  initialData?: InitialData;
  children: ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();

    // Hydrate store with initial server-fetched data
    if (initialData?.solutions && initialData.solutions.length > 0) {
      storeRef.current.dispatch(setSolutions(initialData.solutions));
    }
    if (initialData?.products && initialData.products.length > 0) {
      storeRef.current.dispatch(setProducts(initialData.products));
    }
    if (initialData?.news && initialData.news.length > 0) {
      storeRef.current.dispatch(setNews(initialData.news));
    }
    if (initialData?.featuredArticleId !== undefined && initialData.featuredArticleId !== null) {
      storeRef.current.dispatch(setFeaturedArticleId(initialData.featuredArticleId));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
