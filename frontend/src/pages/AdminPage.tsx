import React from 'react'
import Header from '../components/Header'
import Import from '../components/Import'
import Footer from '../components/Footer'
import { createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Montserrat"].join(","),
  },
});

const AdminPage = () => {
  return (
    <>
     <ThemeProvider theme={theme}>
    <Header></Header>
    <Import></Import>
    <Footer></Footer>
    </ThemeProvider>
    </>
  )
}

export default AdminPage