import { Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { alpha, styled } from "@mui/material/styles";
import { InputBase } from "@mui/material";
import { useState } from "react";
import { ArrowForwardIconCustom } from "@components/icons/arrowForwardIcon";
import { createSearchParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@redux/hooks";
import { translate } from "@constants/lang";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  [theme.breakpoints.down("sm")]: {
    width: "auto",
    height: 36,
    p: 0,
  },
  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  overflow: "hidden",
  border: "1px solid black",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const CourseSearchBar: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();
  const langState = useAppSelector((state) => state.lang.langKey);

  return (
    <Box>
      <Search sx={{ border: "1px solid #cecece" }}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder={translate("search", langState)}
          inputProps={{ "aria-label": "search" }}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" && searchText !== "") {
              navigate({
                pathname: "search",
                search: createSearchParams({
                  keyword: searchText,
                }).toString(),
              });
              setSearchText("");
              e.preventDefault();
            }
          }}
          sx={{ color: "text.primary" }}
        />
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            padding: 0,
            cursor: "pointer",
            "&:hover": {
              background: "inherit",
            },
          }}
          onClick={() => {
            // navigate(`/search?${encodeURIComponent(searchText)}`);
            navigate({
              pathname: "search",
              search: createSearchParams({
                keyword: searchText,
              }).toString(),
            });
            setSearchText("");
          }}
        >
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <ArrowForwardIconCustom
              background="inherit"
              color="primary.main"
            ></ArrowForwardIconCustom>
          </Box>
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <ArrowForwardIconCustom
              background="inherit"
              color="primary.main"
              width={24}
              height={24}
            ></ArrowForwardIconCustom>
          </Box>
        </Box>
      </Search>
    </Box>
  );
};
export default CourseSearchBar;
