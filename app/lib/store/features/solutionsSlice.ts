import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ApiSolutionItem } from "../../../data/solutions-server";
import type { RootState } from "../store";

export interface SolutionsState {
  items: ApiSolutionItem[];
  selectedCategory: string;
  loading: boolean;
  error: string | null;
}

const initialState: SolutionsState = {
  items: [],
  selectedCategory: "All",
  loading: false,
  error: null,
};

export const solutionsSlice = createSlice({
  name: "solutions",
  initialState,
  reducers: {
    setSolutions: (state, action: PayloadAction<ApiSolutionItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSolutionsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSolutionsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setSolutions, setSelectedCategory, setSolutionsLoading, setSolutionsError } = solutionsSlice.actions;

// Selectors
export const selectAllSolutions = (state: RootState) => state.solutions.items;
export const selectSolutionsLoading = (state: RootState) => state.solutions.loading;
export const selectSolutionBySlug = (slug: string) => (state: RootState) => {
  const decoded = decodeURIComponent(slug);
  return state.solutions.items.find((s) => s.slug === decoded || String(s.id) === decoded || s.slug === slug);
};

export default solutionsSlice.reducer;
