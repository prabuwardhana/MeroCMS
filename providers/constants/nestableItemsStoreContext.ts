import { createContext } from "react";
import { UseItemsContextType } from "@/providers/hooks/useNestableItemsContext";

export const ItemsContext = createContext<UseItemsContextType | undefined>(undefined);
