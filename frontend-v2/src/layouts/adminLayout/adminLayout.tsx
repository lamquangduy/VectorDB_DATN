import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import AdminNavBar from "./adminNavbar";

const AdminLayout: React.FC = (): JSX.Element => {
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
      <AdminNavBar></AdminNavBar>

      {/* main content here */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "#f9fafb",
        }}
      >
        <Box
          sx={{
            padding: "24px",
            paddingBottom: "64px",
            maxWidth: "1536px",
            height: "100%",
            width: "100%",
          }}
        >
          <Outlet></Outlet>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
