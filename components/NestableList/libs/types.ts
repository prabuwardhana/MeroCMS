import { CSSProperties, ReactNode } from "react";

export interface NestableProps {
  childrenProp?: string;
  className?: string;
  confirmChange?: ConfirmChange;
  disableDrag?: boolean | DisableDragFn;
  group?: number | string;
  idProp?: string;
  items?: Item[];
  maxDepth?: number;
  onChange?: OnChange;
  onDragEnd?: OnDragEnd;
  onDragStart?: OnDragStart;
  renderListItemContent: RenderItem;
  threshold?: number;
  children?: ReactNode;
}

export interface NestableState {
  accordionOpenItems: string[]; // Open accordions go here
  draggedItem: Item | null; // track the dragged item
  isDropped: boolean; // The dragged item is dragged to certain depth level, but is not yet been dropped
  isStartDragging: boolean; // check if dragging event is started
  mouseClientX: number; // track the mouse clientX position
  mouseShiftXPosition: Mouse; // track the diff from current clientX position with the last clientX position snap
  elemCopyStyles: CSSProperties | null; // Styles for the drag layer (dragged item copy)
  nestableItems: Item[]; // the nestable list items go here
  nestableItemsOld: Item[] | null; // snap copy of the nestable list in case of canceling the dragging
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Item = Record<string, any>;

export type ConfirmChange = (options: { draggedItem: Item; destinationParent: Item | null }) => boolean;

export type DisableDragFn = (options: { item: Item; index?: number; depth?: number }) => boolean;

export type OnChange = (nestableItems: Item[]) => void;

export type OnDragStart = (options: { draggedItem: Item }) => void;

export type OnDragEnd = VoidFunction;

export interface RenderItemOptions {
  item: Item;
  index?: number;
  depth?: number;
  isDraggable: boolean;
  isCopy: boolean | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draggableElAttr: Record<string, any>;
  isAccordionOpen?: boolean;
  eventCallbacks: {
    onRemoveItem: (id: string) => void;
    onInputChange: (field: string, value: string, item: Item) => void;
    onToggleAccordion?: (item: Item) => void;
  };
}

export type RenderItem = (options: RenderItemOptions) => ReactNode;

export interface NestableItemProps {
  item: Item; // The nestable item
  options: NestableItemOptions;
  isCopy?: boolean; // When providing this prop, the item will be the component copy for the drag layer
  index?: number;
  depth?: number;
  children?: ReactNode;
}

export interface NestableItemOptions {
  draggedItem: Item | null;
  idProp: NestableProps["idProp"];
  childrenProp: NestableProps["childrenProp"];
  disableDrag: NestableProps["disableDrag"];
  renderListItemContent: NestableProps["renderListItemContent"];

  checkIfAccordionOpen: (item: Item) => boolean;
  handleDragStart: (e: MouseEvent, item: Item) => void;
  handleMouseEnter: (e: MouseEvent, item: Item) => void;
  handleToggleAccordion: (item: Item) => void;
  handleRemoveItem: (id: string) => void;
  handleInputChange: (field: string, value: string, item: Item) => void;
}

export type Mouse = {
  shift: {
    x: number;
  };
  last: {
    x: number;
  };
};
