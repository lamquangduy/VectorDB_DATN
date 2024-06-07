import { translate } from "@constants/lang";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Tooltip } from "@mui/material";
import { useAppSelector } from "@redux/hooks";
import React from "react";

export const FavoriteIconCustom: React.FC<IconProp> = ({
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          background: "#FFE5E9",
          color: "error.main",
        },
      }}
    >
      <Tooltip title={translate("Remove favorite", langState)}>
        <FavoriteIcon></FavoriteIcon>
      </Tooltip>
    </Box>
  );
};
