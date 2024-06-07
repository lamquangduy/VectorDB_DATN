import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
// import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

// import NestedMenu from "../nestedMenu";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { langEnum, translate } from "@constants/lang";
import { Select } from "@mui/material";
import { setLang } from "@redux/slices/langSlice";
import { ArrowBackIconCustom } from "@components/icons/arrowBackIcon";
import { createBrowserHistory } from "history";

const adminEmails = ["kurokid0206@gmail.com", "ti-pt@fujinet.net"];

// const pages = [
//   // {
//   //   name: "Template",
//   //   link: "/admin/template",
//   // },
//   // {
//   //   name: "Crawl result",
//   //   link: "/admin/crawl-result",
//   // },
//   // {
//   //   name: "General Setting",
//   //   link: "/admin/setting",
//   // },
// ];

function AdminNavBar() {
  const { isAuthenticated, user, logout } = useAuth0();

  const navigate = useNavigate();
  const langState = useAppSelector((state) => state.lang.langKey);
  const dispatch = useAppDispatch();
  // const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
  //   null
  // );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  let history = createBrowserHistory();

  // const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorElNav(event.currentTarget);
  // };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar sx={{ height: 70, background: "white" }}>
      <Container
        maxWidth="xl"
        sx={{ background: "white", height: 70, color: "primary.main" }}
      >
        <Toolbar disableGutters>
          <img
            src="/learnway-logo.png"
            alt="Logo"
            style={{
              objectFit: "contain",
              marginRight: 1,
              width: 56,
              height: 56,
            }}
          />
          <Box
            sx={{
              display: history.location.pathname === "/" ? "none" : "flex",
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
            href="/admin"
            // onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            ADMIN MANAGEMENT
          </Typography>

          {/* <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box> */}

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              pl: "32px",
            }}
          >
            {/* {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => {
                  navigate(page.link);
                }}
                sx={{ my: 2, mx: 2, color: "primary", display: "block" }}
              >
                {page.name}
              </Button>
            ))} */}
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
                      navigate("/");
                    }}
                  >
                    <Typography textAlign="center">
                      {"User home page"}
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={() => {
                    navigate("/user");
                  }}
                >
                  <Typography textAlign="center">{"Profile"}</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    });
                  }}
                >
                  <Typography textAlign="center">{"Logout"}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
          {!isAuthenticated && (
            <Box sx={{ width: 120 }}>
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
    </AppBar>
  );
}
export default AdminNavBar;
