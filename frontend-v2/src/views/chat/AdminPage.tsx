// import { useNavigate } from "react-router-dom";
import Import from "./components/Import";
// import Footer from "./components/Footer";
import { Box, createTheme, ThemeProvider} from "@mui/material";
// import { useEffect } from "react";
// import { useAuth0 } from "@auth0/auth0-react";

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat"].join(","),
  },
});

const ChatAdminPage = () => {
  // const { user } = useAuth0();
  // const navigate = useNavigate();
  // useEffect(() => {
  //   console.log(user);
  //   if (user === null || user === undefined) {
  //     navigate("/login");
  //   }
  // }, [navigate, user]);
  return (
    <ThemeProvider theme={theme}>
      {/* <Header></Header> */}
      <Box>
        {/* <Typography>Learning Assistant</Typography> */}
      </Box>
      <Import></Import>
      {/* <Footer></Footer> */}
    </ThemeProvider>
  );
};

export default ChatAdminPage;
