import { RequestHandler } from "express";
import { FORBIDDEN, UNAUTHORIZED } from "@/core/constants/http";
import Role from "@/core/constants/role";
import appAssert from "../utils/appAssert";
import UserModel from "../models/user.model";

// wrap with catchErrors() if you need this to be async.
const authorize =
  (roles: Role[]): RequestHandler =>
  async (req, res, next) => {
    // Grab the currently logged in user.
    const user = await UserModel.findOne({ _id: req.userId });
    // Throw application error if we can't find one.
    appAssert(user, UNAUTHORIZED, "Not Authorized");

    if (req.userRole)
      req.userRole.forEach((role) => {
        // check if the user has the specified role.
        if (!roles.includes(role))
          // if not, deny the access.
          return res.status(FORBIDDEN).json({ message: "Access Denied" });
        // if the user do, proceed.
        else next();
      });
  };

export default authorize;
