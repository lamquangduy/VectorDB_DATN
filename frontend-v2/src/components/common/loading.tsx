import { Box, CircularProgress } from "@mui/material";
import React from "react";
const Loading: React.FC = (): JSX.Element => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};
export default Loading;
