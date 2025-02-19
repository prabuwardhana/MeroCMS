import { CSSProperties } from "react";
import { Item, Mouse, NestableState } from "../Libs/types";

export const enum NESTABLE_REDUCER_ACTION_TYPE {
  SET_ITEMS,
  SET_ITEMS_OLD,
  SET_ACCORDION_OPEN_ITEMS,
  SET_DRAGGED_ITEM,
  SET_IS_DROPPED,
  SET_IS_START_DRAGGING,
  SET_CLIENT_X,
  SET_MOUSE_POSITION,
  SET_ELEM_COPY_STYLE,
}

type NestableReducerAction =
  | {
      type: NESTABLE_REDUCER_ACTION_TYPE.SET_ITEMS;
      payload: Item[] | null;
    }
  | {
      type: NESTABLE_REDUCER_ACTION_TYPE.SET_ITEMS_OLD;
      payload: Item[] | null;
    }
  | {
      type: NESTABLE_REDUCER_ACTION_TYPE.SET_ACCORDION_OPEN_ITEMS;
      payload: string[];
    }
  | {
      type: NESTABLE_REDUCER_ACTION_TYPE.SET_DRAGGED_ITEM;
      payload: Item | null;
    }
  | {
      type: NESTABLE_REDUCER_ACTION_TYPE.SET_IS_DROPPED;
      payload: boolean;
    }
  | {
      type: NESTABLE_REDUCER_ACTION_TYPE.SET_IS_START_DRAGGING;
      payload: boolean;
    }
  | {
      type: NESTABLE_REDUCER_ACTION_TYPE.SET_CLIENT_X;
      payload: number;
    }
  | {
      type: NESTABLE_REDUCER_ACTION_TYPE.SET_MOUSE_POSITION;
      payload: Mouse;
    }
  | {
      type: NESTABLE_REDUCER_ACTION_TYPE.SET_ELEM_COPY_STYLE;
      payload: CSSProperties | null;
    };

export const nestableReducer = (state: NestableState, action: NestableReducerAction): NestableState => {
  switch (action.type) {
    case NESTABLE_REDUCER_ACTION_TYPE.SET_ITEMS:
      return {
        ...state,
        nestableItems: action.payload as Item[],
      };
    case NESTABLE_REDUCER_ACTION_TYPE.SET_ITEMS_OLD:
      return {
        ...state,
        nestableItemsOld: action.payload as Item[],
      };
    case NESTABLE_REDUCER_ACTION_TYPE.SET_ACCORDION_OPEN_ITEMS:
      return {
        ...state,
        accordionOpenItems: action.payload,
      };
    case NESTABLE_REDUCER_ACTION_TYPE.SET_DRAGGED_ITEM:
      return {
        ...state,
        draggedItem: action.payload as Item,
      };
    case NESTABLE_REDUCER_ACTION_TYPE.SET_IS_DROPPED:
      return {
        ...state,
        isDropped: action.payload,
      };
    case NESTABLE_REDUCER_ACTION_TYPE.SET_IS_START_DRAGGING:
      return {
        ...state,
        isStartDragging: action.payload,
      };
    case NESTABLE_REDUCER_ACTION_TYPE.SET_CLIENT_X:
      return {
        ...state,
        mouseClientX: action.payload,
      };
    case NESTABLE_REDUCER_ACTION_TYPE.SET_MOUSE_POSITION:
      return {
        ...state,
        mouseShiftXPosition: action.payload,
      };
    case NESTABLE_REDUCER_ACTION_TYPE.SET_ELEM_COPY_STYLE:
      return {
        ...state,
        elemCopyStyles: action.payload,
      };
    default:
      throw new Error();
  }
};
