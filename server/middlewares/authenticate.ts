import { RequestHandler } from "express";
import { UNAUTHORIZED } from "../constants/http";
import AppErrorCode from "../constants/appErrorCode";
import { verifyToken } from "../utils/jwt";
import appAssert from "../utils/appAssert";

// wrap with catchErrors() if you need this to be async
const authenticate: RequestHandler = (req, res, next) => {
  // grab the access token from the cookies that are sent back as part of all requests to the server.
  const accessToken = req.cookies.accessToken as string | undefined;
  // Throw application error if the access token doesn't exist.
  appAssert(accessToken, UNAUTHORIZED, "Not authorized", AppErrorCode.InvalidAccessToken);

  // Verify the token.
  const { error, payload } = verifyToken(accessToken);
  // Throw application error if either the token is expired or invalid.
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken,
  );

  // The payload from the token contains the info about the logged in user and its session.
  // modify the request field with the payload from the token.
  req.userId = payload.userId;
  req.userRole = payload.userRole;
  req.sessionId = payload.sessionId;

  next();
};

export default authenticate;
