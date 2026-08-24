import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NewsArticle } from "../../../data/news-articles";
import type { RootState } from "../store";

export interface NewsCategory {
  id: string;
  translations: {
    en: string;
    ar: string;
    fr: string;
  };
}

export interface NewsState {
  articles: NewsArticle[];
  featuredArticleId: string | number | null;
  categories: NewsCategory[];
  selectedCategory: string;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const defaultCategories: NewsCategory[] = [
  { id: "all", translations: { en: "All", ar: "الكل", fr: "Tous" } },
  { id: "company-news", translations: { en: "Company News", ar: "أخبار الشركة", fr: "Actualités de l'entreprise" } },
  { id: "product-update", translations: { en: "Product Update", ar: "تحديثات المنتجات", fr: "Mises à jour des produits" } },
  { id: "partnership", translations: { en: "Partnership", ar: "الشراكات", fr: "Partenariats" } },
  { id: "wholesale-promotions", translations: { en: "Wholesale Promotions", ar: "العروض الترويجية بالجملة", fr: "Promotions de gros" } },
  { id: "events-announcements", translations: { en: "Events & Announcements", ar: "الفعاليات والإعلانات", fr: "Événements & Annonces" } },
];

const initialState: NewsState = {
  articles: [],
  featuredArticleId: null,
  categories: defaultCategories,
  selectedCategory: "all",
  searchQuery: "",
  loading: false,
  error: null,
};

export const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setNews: (state, action: PayloadAction<NewsArticle[]>) => {
      state.articles = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFeaturedArticleId: (state, action: PayloadAction<string | number | null>) => {
      state.featuredArticleId = action.payload;
    },
    setNewsCategories: (state, action: PayloadAction<NewsCategory[]>) => {
      state.categories = action.payload;
    },
    setSelectedNewsCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setNewsSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setNewsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setNewsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setNews,
  setFeaturedArticleId,
  setNewsCategories,
  setSelectedNewsCategory,
  setNewsSearchQuery,
  setNewsLoading,
  setNewsError,
} = newsSlice.actions;

// Selectors
export const selectAllNews = (state: RootState) => state.news.articles;
export const selectNewsLoading = (state: RootState) => state.news.loading;
export const selectFeaturedArticleId = (state: RootState) => state.news.featuredArticleId;
export const selectNewsCategories = (state: RootState) => state.news.categories;
export const selectSelectedNewsCategory = (state: RootState) => state.news.selectedCategory;
export const selectNewsSearchQuery = (state: RootState) => state.news.searchQuery;

export const selectFeaturedArticle = (state: RootState): NewsArticle | null => {
  const articles = state.news.articles;
  if (!articles || articles.length === 0) return null;

  const featId = state.news.featuredArticleId;
  if (featId !== null && featId !== undefined) {
    const found = articles.find((a) => String(a.id) === String(featId) || a.slug === String(featId));
    if (found) return found;
  }

  const flagged = articles.find((a) => a.featured === true);
  if (flagged) return flagged;

  return articles[0];
};

export const selectNewsBySlug = (slug: string) => (state: RootState) => {
  const decoded = decodeURIComponent(slug);
  return state.news.articles.find((a) => a.slug === decoded || String(a.id) === decoded || a.slug === slug);
};

export const selectRelatedNews = (currentSlug: string, count = 3) => (state: RootState) => {
  const decoded = decodeURIComponent(currentSlug);
  const current = state.news.articles.find((a) => a.slug === decoded || String(a.id) === decoded || a.slug === currentSlug);
  const others = state.news.articles.filter((a) => a.slug !== decoded && String(a.id) !== decoded && a.slug !== currentSlug);

  if (!current) return others.slice(0, count);

  const sameCat = others.filter(
    (a) => a.category && current.category && a.category.toLowerCase().trim() === current.category.toLowerCase().trim()
  );
  const diffCat = others.filter(
    (a) => !a.category || !current.category || a.category.toLowerCase().trim() !== current.category.toLowerCase().trim()
  );

  return [...sameCat, ...diffCat].slice(0, count);
};

export default newsSlice.reducer;
