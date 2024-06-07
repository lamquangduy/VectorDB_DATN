import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box } from "@mui/material";
import React from "react";

export const ArrowForwardIconCustom: React.FC<IconProp> = ({
  width = 45,
  height = 45,
  background = "#FFF",
  color = "#000",
  borderRadius = 0,
}) => {
  return (
    <Box
      sx={{
        width: width,
        height: height,
        background: background,
        color: color,
        borderRadius: borderRadius,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ArrowForwardIcon></ArrowForwardIcon>
    </Box>
  );
};
