import React, { ReactElement, ReactNode } from "react";
import { ItemsContext } from "@/providers/constants/nestableItemsStoreContext";
import { useNestableItems } from "@/providers/hooks/useNestableItemsContext";

export const NestableItemsProvider = ({ children }: { children: ReactNode }): ReactElement => {
  return <ItemsContext.Provider value={useNestableItems([])}>{children}</ItemsContext.Provider>;
};
