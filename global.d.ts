import mongoose from "mongoose";
import Role from "./server/constants/role";
import { CounterState } from "./store/counterStore";
import { CounterStoreApi } from "./providers/types/counterStoreApi";

declare global {
  namespace Express {
    interface Request {
      userId: mongoose.Types.ObjectId;
      userRole: Role[];
      sessionId: mongoose.Types.ObjectId;
      tokenExp: boolean;
    }
  }

  namespace Vike {
    interface PageContext {
      // Type of pageContext.user
      user?: {
        id: mongoose.Types.ObjectId;
        sessionId: mongoose.Types.ObjectId;
        role: Role[];
      };
      counterStore: CounterStoreApi;
      counterStoreInitialState: CounterState;
      redirectUrl: string;
      tokenExp: boolean;
      // Refine type of pageContext.Page (it's `unknown` by default)
      Page: () => React.JSX.Element;
    }
  }
}

export {};
