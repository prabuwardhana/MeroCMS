import mongoose from "mongoose";
import Role from "./constants/role";

declare global {
  namespace Express {
    interface Request {
      userId: mongoose.Types.ObjectId;
      userRole: Role[];
      sessionId: mongoose.Types.ObjectId;
    }
  }
}
