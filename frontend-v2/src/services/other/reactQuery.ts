import { QueryClient } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnReconnect: true,
      staleTime: 0,
    },
  },
});

export default queryClient;
