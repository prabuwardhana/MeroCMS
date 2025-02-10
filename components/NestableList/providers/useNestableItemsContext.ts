import { createContext, useContext, useState } from "react";
import { Item } from "@/components/NestableList/Libs/types";

export const useNestableItems = (initialItems: Item[]) => {
  const [items, setItems] = useState<Item[]>(initialItems);

  const addItem = (item: Item) => setItems((prev) => [...prev, item]);
  const updateItems = (items: Item[]) => setItems(items);

  return {
    items,
    addItem,
    updateItems,
  };
};

export type UseItemsContextType = ReturnType<typeof useNestableItems>;

export const ItemsContext = createContext<UseItemsContextType | undefined>(undefined);

export const useNestableItemsContext = () => useContext(ItemsContext) as UseItemsContextType;
