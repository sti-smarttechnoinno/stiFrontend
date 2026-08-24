import { configureStore } from "@reduxjs/toolkit";
import solutionsReducer from "./features/solutionsSlice";
import productsReducer from "./features/productsSlice";
import newsReducer from "./features/newsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      solutions: solutionsReducer,
      products: productsReducer,
      news: newsReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
