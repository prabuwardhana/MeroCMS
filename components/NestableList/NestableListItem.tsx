import React from "react";
import { cn } from "@/src/lib/utils";
import type { NestableItemProps, Item } from "./libs/types";

const NestableListItem = ({ item, isCopy, options, index, depth }: NestableItemProps) => {
  const {
    renderListItemContent,
    draggedItem,
    disableDrag,
    idProp,
    childrenProp,
    checkIfAccordionOpen,
    handleRemoveItem,
    handleInputChange,
    handleToggleAccordion,
  } = options;

  const isAccordionOpen = checkIfAccordionOpen(item);
  const isDragging = !isCopy && draggedItem && draggedItem[idProp!] === item[idProp!];
  const hasChildren = item[childrenProp!] && item[childrenProp!].length > 0;

  let isDraggable = true;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let draggableElAttr: Record<string, any> = {}; // draggable element's attributes

  if (!isCopy) {
    if (draggedItem) {
      // When the item is being dragged
      draggableElAttr = {
        ...draggableElAttr,
        onMouseEnter: (e: MouseEvent) => options.handleMouseEnter(e, item),
      };
    } else {
      if (typeof disableDrag === "function") {
        // When disableDrag is passed as a callback function, call it.
        isDraggable = disableDrag({ item, index, depth });
      } else if (typeof disableDrag !== "undefined") {
        // When disableDrag is passed as a boolean value.
        isDraggable = !disableDrag;
      }

      if (isDraggable) {
        draggableElAttr = {
          ...draggableElAttr,
          draggable: true,
          onDragStart: (e: MouseEvent) => options.handleDragStart(e, item),
        };
      }
    }
  }

  // base class for the list item
  const liBaseClassName = `nestable-item${isCopy ? "-copy" : ""}`;

  // Add classes to the list item depends on some conditions
  const listItemAttr = {
    className: cn(
      `${liBaseClassName} ${liBaseClassName}-${item[idProp!]}`,
      isDragging && "is-dragging",
      hasChildren && `${liBaseClassName}--with-children`,
    ),
  };

  const content = renderListItemContent({
    depth,
    index,
    isDraggable,
    isCopy,
    draggableElAttr,
    item,
    isAccordionOpen,
    eventCallbacks: {
      onRemoveItem: handleRemoveItem,
      onInputChange: handleInputChange,
      onToggleAccordion: handleToggleAccordion,
    },
  });

  if (!content) return null;

  return (
    <li key={index} {...listItemAttr}>
      <div className="nestable-item-name">{content}</div>

      {hasChildren && (
        <ol className="nestable-list">
          {(item[childrenProp!] as Item[]).map((item, i) => {
            return (
              <NestableListItem key={i} index={i} depth={depth! + 1} item={item} options={options} isCopy={isCopy} />
            );
          })}
        </ol>
      )}
    </li>
  );
};

export default NestableListItem;
