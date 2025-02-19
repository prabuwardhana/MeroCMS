import React, {
  createContext,
  useReducer,
  ReactElement,
  useCallback,
  useContext,
  ReactNode,
  CSSProperties,
} from "react";

import { Item, Mouse, NestableState } from "../Libs/types";
import { nestableReducer, NESTABLE_REDUCER_ACTION_TYPE } from "./reducer";

const nestableListInitialState: NestableState = {
  nestableItems: [],
  nestableItemsOld: [],
  accordionOpenItems: [],
  draggedItem: null,
  isDropped: false,
  isStartDragging: false,
  mouseClientX: 0,
  mouseShiftXPosition: {
    shift: { x: 0 },
    last: { x: 0 },
  },
  elemCopyStyles: null,
};

const useNestableListContext = (initState: NestableState) => {
  const [state, dispatch] = useReducer(nestableReducer, initState);

  const setNestableItems = useCallback(
    (payload: Item[] | null) =>
      dispatch({
        type: NESTABLE_REDUCER_ACTION_TYPE.SET_ITEMS,
        payload: payload,
      }),
    [],
  );

  const setNestableItemsOld = useCallback(
    (payload: Item[] | null) =>
      dispatch({
        type: NESTABLE_REDUCER_ACTION_TYPE.SET_ITEMS_OLD,
        payload: payload,
      }),
    [],
  );

  const setAccordionOpenItems = useCallback((payload: string[]) => {
    dispatch({
      type: NESTABLE_REDUCER_ACTION_TYPE.SET_ACCORDION_OPEN_ITEMS,
      payload: payload,
    });
  }, []);

  const setDraggedItem = useCallback(
    (payload: Item | null) =>
      dispatch({
        type: NESTABLE_REDUCER_ACTION_TYPE.SET_DRAGGED_ITEM,
        payload: payload,
      }),
    [],
  );

  const setIsDropped = useCallback(
    (payload: boolean) =>
      dispatch({
        type: NESTABLE_REDUCER_ACTION_TYPE.SET_IS_DROPPED,
        payload: payload,
      }),
    [],
  );

  const setIsStartDragging = useCallback(
    (payload: boolean) =>
      dispatch({
        type: NESTABLE_REDUCER_ACTION_TYPE.SET_IS_START_DRAGGING,
        payload: payload,
      }),
    [],
  );

  const setMouseClientX = useCallback(
    (payload: number) =>
      dispatch({
        type: NESTABLE_REDUCER_ACTION_TYPE.SET_CLIENT_X,
        payload: payload,
      }),
    [],
  );

  const setMousePosition = useCallback(
    (payload: Mouse) =>
      dispatch({
        type: NESTABLE_REDUCER_ACTION_TYPE.SET_MOUSE_POSITION,
        payload: payload,
      }),
    [],
  );

  const setElemCopyStyles = useCallback(
    (payload: CSSProperties | null) =>
      dispatch({
        type: NESTABLE_REDUCER_ACTION_TYPE.SET_ELEM_COPY_STYLE,
        payload: payload,
      }),
    [],
  );

  return {
    state,
    setNestableItems,
    setNestableItemsOld,
    setAccordionOpenItems,
    setDraggedItem,
    setIsDropped,
    setIsStartDragging,
    setMouseClientX,
    setMousePosition,
    setElemCopyStyles,
  };
};

type UseNestableListContextType = ReturnType<typeof useNestableListContext>;

export const NestableContext = createContext<UseNestableListContextType | null>(null);

export const NestableProvider = ({ children }: { children: ReactNode }): ReactElement => {
  return (
    <NestableContext.Provider value={useNestableListContext(nestableListInitialState)}>
      {children}
    </NestableContext.Provider>
  );
};

export const useNestableList = () => {
  return useContext(NestableContext) as UseNestableListContextType;
};
