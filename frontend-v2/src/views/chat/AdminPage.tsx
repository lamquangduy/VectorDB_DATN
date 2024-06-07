import Import from "./components/Import";
// import Footer from "./components/Footer";
import { Box, createTheme, ThemeProvider, Typography } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat"].join(","),
  },
});

const ChatAdminPage = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* <Header></Header> */}
      <Box>
        <Typography variant="h4">Chat Admin Page</Typography>
      </Box>
      <Import></Import>
      {/* <Footer></Footer> */}
    </ThemeProvider>
  );
};

export default ChatAdminPage;
