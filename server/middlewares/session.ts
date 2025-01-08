import { RequestHandler } from "express";
import { verifyToken } from "../utils/jwt";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../constants/http";
import AppErrorCode from "../constants/appErrorCode";

const userSession: RequestHandler = (req, res, next) => {
  // grab the access token from the cookies that are sent back as part of all requests to the server.
  const accessToken = req.cookies.accessToken as string | undefined;

  if (accessToken) {
    // Verify the token.
    const { error, payload } = verifyToken(accessToken);
    // Throw application error if either the token is expired or invalid.
    appAssert(
      payload,
      UNAUTHORIZED,
      error === "jwt expired" ? "Token expired" : "Invalid token",
      AppErrorCode.InvalidAccessToken,
    );
    req.sessionId = payload.sessionId;
    req.userRole = payload.userRole;
  }

  next();
};

export default userSession;
