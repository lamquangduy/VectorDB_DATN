import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import fetchGetUser from "@apolloClient/query/user/getUsers";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { setUser } from "@redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const allowList = [
  "^/$",
  "^/career-detail/",
  "^/search",
  "^/careers",
  "^/blog",
  "^/recommend",
  "^/course",
  "^/user-guide",
  "^/programs",
  // "^/chat",
  "^/survey",
];

const Auth0Guard = ({ children }) => {
  const { isAuthenticated, loginWithRedirect, isLoading, user, logout } =
    useAuth0();
  const reduxUser = useAppSelector((state) => state.user);
  const [previousRoute, setPreviousRoute] = useState(null);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && reduxUser.email === "") {
      fetchGetUser(user.email || "")
        .then((data) => {
          // console.log(data);
          if (data) {
            dispatch(setUser(data));
            // navigate("/");
          } else {
            console.log("nodata from get user! please check!");
          }
        })
        .catch((err) => {
          // console.log("Error when fetch user: ", err);
          dispatch(
            setUser({
              email: user.email,
              first_name: "",
              last_name: "",
              userName: "",
            })
          );
          navigate("/user/complete-info");
        });
    }

    if (!isLoading && !isAuthenticated) {
      let isAllow = false;
      allowList.forEach((path) => {
        if (new RegExp(path).test(window.location.pathname)) {
          isAllow = true;
        }
      });

      if (isAllow) {
        return;
      }
      loginWithRedirect({
        appState: { targetUrl: window.location.pathname },
      }).then();
    }
  }, [isLoading, isAuthenticated, pathname]);

  useEffect(() => {
    if (previousRoute !== null) {
      setPreviousRoute(pathname);
    }
  }, [pathname, previousRoute]);

  let isAllow = false;

  allowList.forEach((path) => {
    if (new RegExp(path).test(window.location.pathname)) {
      isAllow = true;
    }
  });

  if (isAuthenticated || isAllow) {
    if (isLoading) {
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    return <>{children}</>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Auth0Guard;
