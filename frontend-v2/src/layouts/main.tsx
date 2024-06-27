import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "@layouts/navBar";
import { Box, Typography } from "@mui/material";
import useCustomMediaQuery from "@hooks/useCustomMediaQuery";

const MainLayout: React.FC = (): JSX.Element => {
  const useMediaQuery = useCustomMediaQuery();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        paddingTop: "70px",
        boxSizing: "border-box",
      }}
    >
      <NavBar></NavBar>

      {/* main content here */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            minHeight: "100%",
            "& > div:first-child": {
              height: "auto !important",
              minHeight: "100%",
            },
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              padding: useMediaQuery.isMobile ? "8px" : "24px",
              pt: "30px",
              maxWidth: "1536px",
              width: "100%",
              "& > div:first-child": {
                height: "auto !important",
                minHeight: "100% !important",
              },
            }}
          >
            <Outlet></Outlet>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mt: "80px",
            overflow: "visible",
            backgroundColor: "#005f06",
            height: "60px",
            
          }}
        >
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Typography
              sx={{
                color: "white",
                textAlign: "center",
              }}
            >
              © 2024 Learnway. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
