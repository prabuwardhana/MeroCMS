import { mutationErrorHandler, queryErrorHandler } from "@/lib/utils/errorHandler";
import { MutationCache, QueryCache } from "@tanstack/react-query";

const queryClientConfig = () => ({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      suspense: false,
      refetchInterval: 0,
      cacheTime: 0,
      staleTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
  mutationCache: new MutationCache({
    onError: mutationErrorHandler,
  }),
  queryCache: new QueryCache({
    onError: queryErrorHandler,
  }),
});

export default queryClientConfig;
