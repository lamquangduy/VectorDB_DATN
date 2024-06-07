import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { setUser } from "@redux/slices/userSlice";
import { useAppDispatch } from "@redux/hooks";
import fetchGetUser from "@apolloClient/query/user/getUsers";

import MainLayout from "@layouts/main";
import NotFound from "@views/notFound";
import Auth0Login from "@views/login/auth0";
import ChatPage from "@views/chat/ChatPage";
import ChatAdminPage from "@views/chat/AdminPage";

const pathList: RouterElement[] = [
  {
    path: "/login",
    element: <Auth0Login />,
  },

  {
    path: "/chat",
    element: <ChatPage />,
  },
  {
    path: "chat-admin",
    element: <ChatAdminPage />,
  },
];

const NavigationRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuth0();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      fetchGetUser(user?.email || "")
        .then((data) => {
          console.log("data here:  ", data);
          if (data) {
            dispatch(setUser(data));
          } else {
            dispatch(
              setUser({
                email: user?.email || "",
                first_name: "",
                last_name: "",
                userName: "",
              })
            );
            ``;
          }
        })
        .catch((_err) => {
          console.log("error here:  ");

          dispatch(
            setUser({
              email: user?.email || "",
              first_name: "",
              last_name: "",
              userName: "",
            })
          );
        });
    }
  }, [isAuthenticated, user]);
  //define your all page below

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {pathList.map((item) => (
          <Route path={item.path} element={item.element} key={item.path} />
        ))}
      </Route>

      <Route path="*" element={<NotFound />}></Route>
    </Routes>
    // <BrowserRouter>
    // </BrowserRouter>
  );
};
export default NavigationRouter;
