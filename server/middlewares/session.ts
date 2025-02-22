import { RequestHandler } from "express";
import { Types } from "mongoose";
import { verifyToken } from "../utils/jwt";

const verifyAuthCookies: RequestHandler = (req, _res, next) => {
  const userToken = req.cookies.userToken as string;
  req.userId = userToken ? new Types.ObjectId(userToken) : undefined;

  const accessToken = req.cookies.accessToken as string | undefined;

  if (accessToken) {
    // The access token is presence. Verify the token.
    const { error, payload } = verifyToken(accessToken);
    if (error) {
      req.isValidToken = false;
    }
    if (payload) {
      req.userId = payload.userId;
      req.userRole = payload.userRole;
      req.isValidToken = true;
    }
  }

  next();
};

export default verifyAuthCookies;
