import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";

import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation, useNavigate } from "react-router-dom";

import CourseSearchBar from "@components/search/courseSearchBar";

import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { langEnum, translate } from "@constants/lang";
import { Select } from "@mui/material";
import { setLang } from "@redux/slices/langSlice";
import ExploreMenu from "./exploreMenu";
import { ArrowBackIconCustom } from "@components/icons/arrowBackIcon";
import { createBrowserHistory } from "history";
import styled from "styled-components";

const appNameImg = "/Learnway.png";
const AppbarCustom = styled(AppBar)(() => ({
  border: "1px solid #cecece",
}));

const adminEmails = ["kurokid0206@gmail.com", "ti-pt@fujinet.net"];
function NavBar() {
  const langState = useAppSelector((state) => state.lang.langKey);
  const dispatch = useAppDispatch();
  const location = useLocation();

  // responsive
  // const mobileMatches = useMediaQuery("only screen and (max-width: 768px)");

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { isAuthenticated, user, logout } = useAuth0();

  const navigate = useNavigate();
  let history = createBrowserHistory();
  return (
    <AppbarCustom sx={{ height: 70, background: "white" }}>
      <Container
        maxWidth="xl"
        sx={{ background: "white", height: 70, color: "primary.main" }}
      >
        <Toolbar disableGutters sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display:
                history.location.pathname === "/"
                  ? "none"
                  : { xs: "none", md: "flex" },
            }}
          >
            <Tooltip title="Go Back">
              <IconButton
                onClick={() => {
                  history.back();
                }}
              >
                <ArrowBackIconCustom
                  background="transparent"
                  color="primary.main"
                ></ArrowBackIconCustom>
              </IconButton>
            </Tooltip>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 4,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <img
                src="/learnway-logo.png"
                alt="Logo"
                style={{
                  objectFit: "contain",
                  marginRight: 1,
                  height: 36,
                }}
              />

              <img
                src={appNameImg}
                alt="LEANWAY"
                style={{ height: 36, marginTop: 6 }}
              />
            </Box>
          </Typography>

          {/* logo use for mobile start */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 4,
              display: { xs: "flex", md: "none" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img src={appNameImg} alt="LEANWAY" style={{ height: 24 }} />
          </Typography>
          {/* logo for mobile end */}

          <ExploreMenu />

          <Box
            sx={{
              pl: 2,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              gap: 0.5,
            }}
          >
            <Button
              id="basic-button"
              onClick={() => {
                if (isAuthenticated && user) {
                  navigate("/user/learning-path");
                } else {
                  navigate("/recommend");
                }
              }}
              variant="outlined"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                borderWidth: "2px",
                paddingX: "16px",
                textTransform: "none",
              }}
            >
              {translate("Recommend courses", langState)}
            </Button>

            {/* <Button
              id="basic-button"
              onClick={() => {
                navigate("/survey");
              }}
              variant="outlined"
              sx={{
                fontSize: "16px",
                fontWeight: "bold",
                borderWidth: "2px",
                paddingX: "16px",
                textTransform: "none",
              }}
            >
              Survey
            </Button> */}
          </Box>

          <Box
            sx={{
              flex: 1,
              display: { xs: "flex", md: "flex" },
              justifyContent: "flex-end",
            }}
          >
            <Box>
              {location.pathname === "/search" ? null : <CourseSearchBar />}
              {/* <CourseSearchBar /> */}
            </Box>
          </Box>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={langState}
            onChange={(event) => {
              if (event.target.value == langEnum.vi) {
                dispatch(setLang(langEnum.vi));
              } else {
                dispatch(setLang(langEnum.en));
              }
            }}
            variant="outlined"
            sx={{
              display: { xs: "none", md: "flex" },
              marginRight: "16px",
              height: 45,
              width: 120,
            }}
          >
            <MenuItem value={langEnum.en}>English</MenuItem>
            <MenuItem value={langEnum.vi}>Tiếng Việt</MenuItem>
          </Select>

          {isAuthenticated && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={user?.picture} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {adminEmails.includes(user?.email ?? "") && (
                  <MenuItem
                    onClick={() => {
                      navigate("/admin");
                      handleCloseUserMenu();
                    }}
                    sx={{ width: 212, paddingX: 4 }}
                  >
                    <Typography textAlign="center">
                      {translate("Admin", langState)}
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    navigate("/user");
                    handleCloseUserMenu();
                  }}
                  sx={{ width: 212, paddingX: 4 }}
                >
                  <Typography textAlign="center">
                    {translate("Profile", langState)}
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/user/courses");
                    handleCloseUserMenu();
                  }}
                  sx={{ width: 212, paddingX: 4 }}
                >
                  <Typography textAlign="center">
                    {translate("Your courses", langState)}
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/user/learning-path");
                    handleCloseUserMenu();
                  }}
                  sx={{ width: 212, paddingX: 4 }}
                >
                  <Typography textAlign="center">
                    {translate("Learning path", langState)}
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    });
                    handleCloseUserMenu();
                  }}
                  sx={{ width: 212, paddingX: 4 }}
                >
                  <Typography textAlign="center">
                    {translate("Sign out", langState)}
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
          {!isAuthenticated && (
            <Box>
              <Button
                sx={{ color: "primary.main" }}
                onClick={() => {
                  navigate("/login");
                }}
              >
                {translate("login", langState)}
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppbarCustom>
  );
}
export default NavBar;
