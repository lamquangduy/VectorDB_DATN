import { translate } from "@constants/lang";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Box, Tooltip } from "@mui/material";
import { useAppSelector } from "@redux/hooks";
import React from "react";

export const FavoriteBorderIconCustom: React.FC<IconProp> = ({
  width = 45,
  height = 45,
  background = "#FFF",
  color = "#000",
  borderRadius = 0,
}) => {
  const langState = useAppSelector((state) => state.lang.langKey);
  return (
    <Box
      sx={{
        width: width,
        height: height,
        background: background,
        color: color,
        borderRadius: borderRadius,
        border: "1px solid #CECECE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          background: "#FFE5E9",
          color: "error.main",
        },
      }}
    >
      <Tooltip title={translate("Add to favorite", langState)}>
        <FavoriteBorderIcon></FavoriteBorderIcon>
      </Tooltip>
    </Box>
  );
};
