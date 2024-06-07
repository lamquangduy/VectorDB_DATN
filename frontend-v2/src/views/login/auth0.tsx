import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { setUser } from "@redux/slices/userSlice";
import fetchGetUser from "@apolloClient/query/user/getUsers";
import { useAppDispatch } from "@redux/hooks";
import { Box, CircularProgress } from "@mui/material";
const Auth0Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    isAuthenticated,
    loginWithRedirect,
    isLoading,
    user,
    // logout,
    error,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      getAccessTokenSilently().then((token) => {
        localStorage.setItem("token", token);
      });
      fetchGetUser(user!.email || "")
        .then((data) => {
          if (data) {
            dispatch(setUser(data));
            navigate("/");
          }
        })
        .catch((err) => {
          console.log("Error when fetch user: ", err);
          dispatch(
            setUser({
              email: user!.email || "",
              first_name: "",
              last_name: "",
              userName: "",
            })
          );
          navigate("/user/complete-info");
        });
    }
    if (!isLoading && !isAuthenticated) {
      if (error) {
        console.log(`error ${error}`);
      }
      loginWithRedirect({
        appState: { targetUrl: window.location.pathname },
      }).then();
    }

    // eslint-disable-next-line
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Auth0Login;
