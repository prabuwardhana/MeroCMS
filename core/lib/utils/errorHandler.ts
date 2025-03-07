import { render } from "vike/abort";
import { Mutation, Query, QueryKey } from "@tanstack/react-query";
import API from "@/core/config/apiClient";
import { UNAUTHORIZED } from "@/core/constants/http";
import AppError from "@/server/utils/AppError";
import { AxiosError } from "axios";
import queryClientConfig from "@/pages/admin/+queryClientConfig";

let isRefreshing = false;

let failedQueue: {
  query?: Query<unknown, unknown, unknown, QueryKey>;
  mutation?: Mutation<unknown, unknown, unknown, unknown>;
  variables?: unknown;
}[] = [];

const processFailedQueue = () => {
  failedQueue.forEach(({ query, mutation, variables }) => {
    if (query) {
      query.fetch();
    }
    if (mutation) {
      mutation.execute(variables);
    }
  });
  isRefreshing = false;
  failedQueue = [];
};

const refreshTokenAndRetry = async (
  query?: Query<unknown, unknown, unknown, QueryKey>,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown,
) => {
  try {
    if (!isRefreshing) {
      isRefreshing = true;
      failedQueue.push({ query, mutation, variables });
      await API.get("/api/auth/refresh");
      processFailedQueue();
    } else {
      failedQueue.push({ query, mutation, variables });
    }
  } catch {
    queryClientConfig().queryCache.clear();
    throw render("/auth/login");
  }
};

const errorHandler = (
  error: unknown,
  query?: Query<unknown, unknown, unknown, QueryKey>,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { status, errorCode } = error as AxiosError<any> & AppError;

  if (status === UNAUTHORIZED && errorCode === "InvalidAccessToken") {
    if (query) refreshTokenAndRetry(query);
    if (mutation) refreshTokenAndRetry(undefined, mutation, variables);
  }
};

export const queryErrorHandler = (error: unknown, query: Query<unknown, unknown, unknown, QueryKey>) => {
  errorHandler(error, query);
};

export const mutationErrorHandler = (
  error: unknown,
  variables: unknown,
  _context: unknown,
  mutation: Mutation<unknown, unknown, unknown, unknown>,
) => {
  errorHandler(error, undefined, mutation, variables);
};
