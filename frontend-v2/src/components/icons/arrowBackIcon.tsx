import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box } from "@mui/material";
import React from "react";

export const ArrowBackIconCustom: React.FC<IconProp> = ({
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
      <ArrowBackIcon></ArrowBackIcon>
    </Box>
  );
};
