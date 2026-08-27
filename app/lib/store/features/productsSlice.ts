import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ApiProductItem } from '@/app/data/products-server';
import type { RootState } from "../store";

export interface ProductsState {
  items: ApiProductItem[];
  selectedCategory: string;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  selectedCategory: "All",
  searchQuery: "",
  loading: false,
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ApiProductItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setProductCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setProductSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProductsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setProducts,
  setProductCategory,
  setProductSearchQuery,
  setProductsLoading,
  setProductsError,
} = productsSlice.actions;

// Selectors
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectProductSelectedCategory = (state: RootState) => state.products.selectedCategory;
export const selectProductSearchQuery = (state: RootState) => state.products.searchQuery;
export const selectProductsLoading = (state: RootState) => state.products.loading;

export const selectProductBySlug = (slug: string) => (state: RootState) => {
  const decoded = decodeURIComponent(slug);
  return state.products.items.find((p) => p.slug === decoded || String(p.id) === decoded || p.slug === slug);
};

export default productsSlice.reducer;
