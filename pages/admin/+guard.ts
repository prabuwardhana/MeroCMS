export { guard };

import type { GuardAsync } from "vike/types";
import { render } from "vike/abort";

// environment: server
const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  const { user, urlOriginal } = pageContext;

  // Upon page navigation, Vike makes a pageContext.json HTTP request to the server,
  // in order to pass data fetched on the server-side to the client-side.
  // When Vike is able to make a pageContext.json HTTP request for the admin page
  // but then the server sets the user to null, it indicates that the user is actually
  // logged in but missing its access token.
  // In such cases, proceed to the data() hook and allow it to invoke the API's refresh endpoint
  // to verify whether the user still possesses a valid refresh token or not.
  // If not, the user will be redirected to login page by the Axios instance interceptor
  // on the client-side.
  if (user === null && !urlOriginal.includes("json")) {
    // https://vike.dev/abort
    // this should be called on the server-side.
    // calling this on the client-side leads to a strange behaviour.
    throw render("/auth/login");
  }
};
