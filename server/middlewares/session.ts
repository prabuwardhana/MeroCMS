import { RequestHandler } from "express";
import { verifyToken } from "../utils/jwt";
import { UNAUTHORIZED } from "../constants/http";

// this middleware is invoked when Vike makes an HTTP request.
// Consequently, errors won't be handled by the Axios instance interceptor.
// We need a way to tell Vike that either the access token is not presence or has been expired.
const vikeSession: RequestHandler = (req, _res, next) => {
  // grab the access token from the cookies that are sent back as part of all requests to the server.
  const accessToken = req.cookies.accessToken as string | undefined;

  if (accessToken) {
    // The access token is presence. Verify the token.
    const { error, payload } = verifyToken(accessToken);
    if (error) {
      req.tokenExp = true;
    }
    if (payload) {
      req.userId = payload.userId;
      req.sessionId = payload.sessionId;
      req.userRole = payload.userRole;
      req.tokenExp = false;
    }
  } else {
    // The access token is missing.
    // But, we can't throw an Error here because we don't want
    // an error page that merely says "internal server error".
    // In fact, we don't even need an error page.
    // We only need to tell Vike that the user has no access token
    // and allow it to handle this situation.
    req.statusCode = UNAUTHORIZED;
  }

  next();
};

export default vikeSession;
