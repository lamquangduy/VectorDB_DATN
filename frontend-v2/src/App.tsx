import "./App.css";

import { ThemeProvider } from "@mui/material/styles";
import NavigationRouter from "@routers/router";
import theme from "@utils/theme";
import { QueryClientProvider } from "react-query";
import queryClient from "./services/other/reactQuery";
import store from "@redux/store";
import { Provider } from "react-redux";
import Auth0Guard from "@components/auth/Auth0Guard";
import { Suspense } from "react";
import Loading from "@components/common/loading";

function App() {
  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Auth0Guard>
            <ThemeProvider theme={theme}>
              <Suspense fallback={<Loading />}>
                <NavigationRouter />
              </Suspense>
            </ThemeProvider>
          </Auth0Guard>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default App;
