import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { langEnum } from "@constants/lang";

//useState base on userCredential.user from response of firebase
interface LangState {
  langKey: langEnum;
}

// Define the initial state using that type
const initialState = (): LangState => {
  const lastState = localStorage.getItem("lang");
  if (lastState) {
    if (lastState === langEnum.vi) {
      return { langKey: langEnum.vi };
    }
    return { langKey: langEnum.en };
  }
  localStorage.setItem("lang", langEnum.en);
  return { langKey: langEnum.en };
};

export const langSlice = createSlice({
  name: "langSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLang: (state, action: PayloadAction<langEnum>) => {
      localStorage.setItem("lang", action.payload);
      state.langKey = action.payload;
    },
  },
});

export const { setLang } = langSlice.actions;

export default langSlice.reducer;
