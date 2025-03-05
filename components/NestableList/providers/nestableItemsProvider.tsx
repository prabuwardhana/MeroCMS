import React, { ReactElement, ReactNode } from "react";
import { ItemsContext, useNestableItems } from "./useNestableItemsContext";

export const NestableItemsProvider = ({ children }: { children: ReactNode }): ReactElement => {
  return <ItemsContext.Provider value={useNestableItems([])}>{children}</ItemsContext.Provider>;
};
