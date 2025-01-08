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

  namespace Vike {
    interface PageContext {
      // Type of pageContext.user
      user?: {
        sessionId: mongoose.Types.ObjectId;
        role: Role[];
      };
      // Refine type of pageContext.Page (it's `unknown` by default)
      Page: () => React.JSX.Element;
    }
  }
}

export {};
