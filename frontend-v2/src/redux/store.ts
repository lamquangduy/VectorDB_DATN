import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userSlice from "./slices/userSlice";
import langSlice from "./slices/langSlice";
// ...
const store = configureStore({
  reducer: {
    user: userSlice,
    lang: langSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
