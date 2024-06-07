import { styled } from "@mui/material";
import TextField from "@mui/material/TextField";
export const LWCustomTextField = styled(TextField)(() => {
  return {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#34314C",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#00c200",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      display: "none",
    },
    "& .MuiInputBase-root": {
      outline: "1px solid #cecece",
      border: "none",
    },
    "& .MuiInputBase-root:focus-within": {
      outline: "2px solid #00c200 ",
      border: "none",
    },
  };
});
