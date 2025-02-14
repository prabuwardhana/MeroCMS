// const [pageComponents, setPageComponents] = useState<Array<PageComponentType>>([]);
import { PageComponentType } from "@/lib/types";
import { create } from "zustand";

type PageComponentsState = {
  pageComponents: PageComponentType[];
};

type PageComponentsStateAction = {
  setPageComponents: (value: PageComponentType[]) => void;
};

export type PageComponentsStore = PageComponentsState & PageComponentsStateAction;

const defaultInitState: PageComponentsState = {
  pageComponents: [],
};

export const usePageComponentsStore = create<PageComponentsStore>()((set) => ({
  ...defaultInitState,
  setPageComponents: (pageComponent) => {
    set(() => ({ pageComponents: [...pageComponent] }));
  },
}));
