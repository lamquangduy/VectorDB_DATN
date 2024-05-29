import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatBotPage from "../pages/ChatBotPage";
import AdminPage from "../pages/AdminPage";

interface RouterElement {
  path: string;
  element: React.ReactNode;
}

const pathList: RouterElement[] = [
  {
    path: "/",
    element: <ChatBotPage />,
  },
  {
    element: <AdminPage />,
    path: "/admin",
  },
];

const NavigationRouter: React.FC = () => {
  return (
    <Routes>
      {pathList.map((item) => (
        <Route path={item.path} element={item.element} key={item.path} />
      ))}
    </Routes>
  );
};
export default NavigationRouter;
