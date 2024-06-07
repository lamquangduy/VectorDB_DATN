import { SxProps } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
interface LWTitleProps {
  text?: string;
  children?: React.ReactNode;
  sx?: SxProps;
}
const LWTitle: React.FC<LWTitleProps> = ({ text, children }): JSX.Element => {
  return (
    <Box
      sx={{
        fontSize: "20px",
        color: "text.primary",
      }}
    >
      {text}
      {children}
    </Box>
  );
};
export default LWTitle;
