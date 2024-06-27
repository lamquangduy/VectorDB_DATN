// import { useNavigate } from "react-router-dom"
// import Footer from "./components/Footer";
import { Box, createTheme, ThemeProvider} from "@mui/material";
import AdminSideBar from "./components/AdminSideBar";
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
        {/* <Typography>Insert to Vector Database</Typography> */}
      </Box>
      {/* <Import></Import> */}
      <AdminSideBar/>
      {/* <Footer></Footer> */}
    </ThemeProvider>
  )
};

export default ChatAdminPage;
