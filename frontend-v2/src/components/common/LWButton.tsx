import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
export const LWButton = styled(Button)(() => {
  //please include prop variant='contained' when using this component
  return {
    backgroundColor: "primary.main",
    minWidth: 129,
    height: 31,
    paddingTop: "6px",
    paddingBottom: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    textWrap: "nowrap",
    borderRadius: "4px",
    color: "currentcolor",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#067a06",
      color: "white",
    },
  };
});
