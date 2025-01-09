import { RequestHandler } from "express";
import { verifyToken } from "../utils/jwt";

const userSession: RequestHandler = (req, _res, next) => {
  // grab the access token from the cookies that are sent back as part of all requests to the server.
  const accessToken = req.cookies.accessToken as string | undefined;

  if (accessToken) {
    // Verify the token.
    const { payload } = verifyToken(accessToken);

    if (payload) {
      req.userId = payload.userId;
      req.sessionId = payload.sessionId;
      req.userRole = payload.userRole;
    }
  }

  next();
};

export default userSession;
