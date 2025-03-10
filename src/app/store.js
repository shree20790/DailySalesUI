import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "./loaderSlice";
import listReducer from "./listSlice";
import themeConfigSlice from "./themeConfigSlice";

export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    list: listReducer,
    themeConfig: themeConfigSlice,
  },
});

export default store;
