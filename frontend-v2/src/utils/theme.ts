import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#019b01",
      light: "#87B23C",
      dark: "#018D36",
    },
    secondary: {
      main: "#01879b",
    },
    error: {
      main: "#9b0101",
      light: "#FFE5E9",
    },
    text: {
      primary: "rgb(52, 60, 75)",
      secondary: "rgb(52, 60, 75)",
    },
  },
  typography: {
    fontFamily: ["Source Sans 3"].join(","),
  },
});
export default theme;
