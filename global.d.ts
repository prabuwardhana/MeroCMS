import mongoose from "mongoose";
import Role from "./server/constants/role";
import { CounterState } from "./store/counterStore";
import { CounterStoreApi } from "./providers/types/counterStoreApi";
import type { User } from "./lib/types";

declare global {
  namespace Express {
    interface Request {
      userId?: mongoose.Types.ObjectId;
      userRole?: Role[];
      sessionId?: mongoose.Types.ObjectId;
      isValidToken?: boolean;
    }
  }

  namespace Vike {
    interface PageContext {
      user: User;
      counterStore: CounterStoreApi;
      counterStoreInitialState: CounterState;
      redirectUrl: string;
      isValidToken: boolean;
      // Refine type of pageContext.Page (it's `unknown` by default)
      Page: () => React.JSX.Element;
    }
  }
}

export {};
