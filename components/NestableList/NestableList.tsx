import React from "react";
import { type CSSProperties, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { produce } from "immer";

import { closest, getOffsetRect, getTotalScroll, getTransformProps, listWithChildren } from "./Libs/utils";

import { NestableProps, NestableItemOptions, Item } from "./Libs/types";

import NestableListItem from "./NestableListItem";
import { useNestableList } from "./store/context";

import "./styles.css";

const Nestable = ({
  childrenProp = "children",
  idProp = "id",
  disableDrag = false,
  group = Math.random().toString(36).slice(2),
  threshold = 40,
  maxDepth = 10,
  items = [],
  className,
  confirmChange = () => true,
  onChange = () => {},
  onDragEnd = () => {},
  onDragStart = () => {},
  renderListItemContent,
}: NestableProps) => {
  // Component states
  const {
    state,
    setNestableItems,
    setNestableItemsOld,
    setAccordionOpenItems,
    setDraggedItem,
    setIsDropped,
    setIsStartDragging,
    setMouseClientX,
    setElemCopyStyles,
    setMousePosition,
  } = useNestableList();
  // const test = useNestableList();

  const {
    nestableItems,
    nestableItemsOld,
    accordionOpenItems,
    draggedItem,
    isDropped,
    isStartDragging,
    mouseClientX,
    mouseShiftXPosition,
    elemCopyStyles,
  } = state;
  // const {
  //   nestableItems,
  //   nestableItemsOld,
  //   accordionOpenItems,
  //   draggedItem,
  //   isDropped,
  //   isStartDragging,
  //   mouseClientX,
  //   mouseShiftXPosition,
  //   elemCopyStyles,
  // } = test!.state;

  // DOM reference
  const dragLayerRef = useRef<HTMLOListElement>(null);
  const nestableListRef = useRef<HTMLOListElement>(null);

  let targetElem: Element | null = null;

  const getPathById = useCallback(
    (id: unknown, items = nestableItems) => {
      let path: number[] = [];

      items.every((item, i) => {
        if (item[idProp] === id) {
          // When the item id is equal to id

          // fill the path array with the index
          path.push(i);
        } else if (item[childrenProp]) {
          // When not, check if it has children

          // find the id within the children array
          const childrenPath = getPathById(id, item[childrenProp]);

          if (childrenPath.length) {
            // When it's found in the children array,
            // fill the array with the index of the parrent and
            // the index of the children array
            path = path.concat(i).concat(childrenPath);
          }
        }

        return path.length === 0;
      });

      return path;
    },
    [nestableItems],
  );

  const getItemByPath = (path: number[], items = nestableItems) => {
    let item: Item | null = null;

    path.forEach((index) => {
      // In the first iteration, "item" is null.
      // Then, "list" will be filled by the "items" array
      // If it goes to the second iteration and onward,
      // it means that the path points to the cildren array of that particular item.
      const list = item ? item[childrenProp] : items;
      item = list[index];
    });

    return item;
  };

  const getRealNextPath = (prevPath: number[], nextPath: number[], draggedItemSize: number): number[] => {
    const ppLastIndex = prevPath.length - 1;
    const npLastIndex = nextPath.length - 1;
    const newDepth = nextPath.length + draggedItemSize - 1;

    if (prevPath.length < nextPath.length) {
      // move into depth
      let wasShifted = false;

      // if new depth exceeds max, try to put after item instead of into item
      if (newDepth > maxDepth! && nextPath.length) {
        return getRealNextPath(prevPath, nextPath.slice(0, -1), draggedItemSize);
      }

      return nextPath.map((nextIndex, i) => {
        if (wasShifted) {
          return i === npLastIndex ? nextIndex + 1 : nextIndex;
        }

        if (typeof prevPath[i] !== "number") {
          return nextIndex;
        }

        if (nextPath[i] > prevPath[i] && i === ppLastIndex) {
          wasShifted = true;
          return nextIndex - 1;
        }

        return nextIndex;
      });
    } else if (prevPath.length === nextPath.length) {
      // if move bottom + move to item with children --> make it a first child instead of swap
      if (nextPath[npLastIndex] > prevPath[npLastIndex]) {
        const target = getItemByPath(nextPath);

        if (target) {
          if (newDepth < maxDepth! && target[childrenProp] && (target[childrenProp] as Item[]).length) {
            return nextPath
              .slice(0, -1)
              .concat(nextPath[npLastIndex] - 1)
              .concat(0);
          }
        }
      }
    }

    return nextPath;
  };

  const getItemDepth = (item: Item) => {
    let level = 1;

    if (item[childrenProp].length > 0) {
      const childrenDepths = item[childrenProp].map(getItemDepth);
      level += Math.max(...childrenDepths);
    }

    return level;
  };

  const moveItem = ({ draggedItem, pathFrom, pathTo }: { draggedItem: Item; pathFrom: number[]; pathTo: number[] }) => {
    const draggedItemSize = getItemDepth(draggedItem);

    // the remove action might affect the next position,
    // so update next coordinates accordingly
    const realPathTo = getRealNextPath(pathFrom, pathTo, draggedItemSize);

    if (realPathTo.length === 0) return;

    // user can validate every movement
    const destinationPath = realPathTo.length > pathTo.length ? pathTo : pathTo.slice(0, -1);
    const destinationParent = getItemByPath(destinationPath);

    // Prevent moving the item if confirmChange returns false
    if (confirmChange && !confirmChange({ draggedItem, destinationParent })) return;

    let newItems = produce(nestableItems, (draft) => {
      const lastIndex = pathFrom.length - 1;
      const route: (number | string)[] = [];

      // remove the draggedItem from the list
      pathFrom.forEach((index, i) => {
        if (i === lastIndex) {
          // When the path length is 1, it means it has no children
          if (pathFrom.length === 1) {
            route.push(index);
            draft.splice(index, 1);
          } else {
            route
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .reduce((accumulator: any, currentValue: any) => {
                return accumulator[currentValue];
              }, draft)
              .splice(index, 1);
          }
        } else {
          route.push(index, childrenProp);
        }
      });
    });

    // put it back to a different position in the list
    newItems = produce(newItems, (draft) => {
      const lastIndex = realPathTo.length - 1;
      const route: (number | string)[] = [];

      realPathTo.forEach((index, i) => {
        if (i === lastIndex) {
          // When the path length is 1, it means it has no children
          if (realPathTo.length === 1) {
            route.push(index);
            draft.splice(index, 0, draggedItem);
          } else {
            route
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .reduce((accumulator: any, currentValue: any) => {
                return accumulator[currentValue];
              }, draft)
              .splice(index, 0, draggedItem);
          }
        } else {
          route.push(index, childrenProp);
        }
      });
    });

    setNestableItems(newItems);
  };

  // This function is called from the useEffect hook and listed as the dependencies.
  // Preserve the reference to this function between re-renders,
  // as long as the draggedItem state doesn't change.
  const tryIncreaseDepth = useCallback(
    (draggedItem: Item) => {
      const pathFrom = getPathById(draggedItem[idProp]);
      const itemIndex = pathFrom[pathFrom.length - 1];
      const newDepth = pathFrom.length + getItemDepth(draggedItem);

      // has previous sibling and isn't at max depth
      if (itemIndex > 0 && newDepth <= maxDepth!) {
        const prevSibling = getItemByPath(pathFrom.slice(0, -1).concat(itemIndex - 1));

        if (prevSibling) {
          const pathTo = pathFrom
            .slice(0, -1)
            .concat(itemIndex - 1)
            .concat((prevSibling[childrenProp] as Item[]).length);

          moveItem({ draggedItem, pathFrom, pathTo });
        }
      }
    },
    [draggedItem, getPathById],
  );

  // This function is called from the useEffect hook and listed as the dependencies.
  // Preserve the reference to this function between re-renders,
  // as long as the draggedItem state doesn't change.
  const tryDecreaseDepth = useCallback(
    (draggedItem: Item) => {
      const pathFrom = getPathById(draggedItem[idProp]);
      const itemIndex = pathFrom[pathFrom.length - 1];
      // only allow decresing path for item that has parent
      if (pathFrom.length > 1) {
        const parent = getItemByPath(pathFrom.slice(0, -1));
        if (parent) {
          // is last (by order) item in array
          if (itemIndex + 1 === (parent[childrenProp] as Item[]).length) {
            const pathTo = pathFrom.slice(0, -1);
            pathTo[pathTo.length - 1] += 1;
            moveItem({ draggedItem, pathFrom, pathTo });
          }
        }
      }
    },
    [draggedItem, getPathById],
  );

  const dragApply = () => {
    setNestableItemsOld(null);
    setElemCopyStyles(null);
    setDraggedItem(null);
    setIsDropped(true);
  };

  const dragRevert = () => {
    setNestableItems(nestableItemsOld);
    setNestableItemsOld(null);
    setElemCopyStyles(null);
    setDraggedItem(null);
    setIsDropped(false);
  };

  const handleDragStart = (e: MouseEvent, item: Item) => {
    e.preventDefault();
    e.stopPropagation();

    if (!(e.target instanceof Element)) return;

    targetElem = closest(e.target, ".nestable-item");

    handleMouseMove(e);

    setIsStartDragging(true);
    setDraggedItem(item);
    setNestableItemsOld(nestableItems);

    onDragStart({ draggedItem: item });
  };

  const handleDragEnd = (e: MouseEvent | null, isCancel?: boolean) => {
    e?.preventDefault();

    stopTrackMouse();
    setIsStartDragging(false);

    targetElem = null;

    onDragEnd();

    if (isCancel) dragRevert();
    else dragApply();
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const transformProps = getTransformProps(clientX, clientY);

    if (!elemCopyStyles) {
      const offset = getOffsetRect(targetElem!);
      const scroll = getTotalScroll(targetElem!);

      setElemCopyStyles({
        marginTop: offset.top - clientY - scroll.top,
        marginLeft: offset.left - clientX - scroll.left,
        ...transformProps,
      });
    } else {
      setElemCopyStyles({
        ...elemCopyStyles,
        ...transformProps,
      });

      const keys = Object.keys(transformProps) as Array<keyof typeof transformProps>;

      keys.forEach((key: keyof typeof transformProps) => {
        if (dragLayerRef.current) dragLayerRef.current.style[key] = transformProps[key];
      });

      setMouseClientX(clientX);
    }
  };

  const handleMouseEnter = (e: MouseEvent, item: Item) => {
    e.preventDefault();

    // No need to proceed if the item is dragged just to
    // increase or decrease the depth
    if (draggedItem![idProp] === item[idProp]) return;

    const pathFrom = getPathById(draggedItem![idProp]);
    const pathTo = getPathById(item[idProp]);
    const itemIndex = pathTo.length - 1;
    const replacedItem = getItemByPath(pathTo);

    if (replacedItem && (replacedItem[childrenProp] as Item[]).length) {
      if (pathTo[itemIndex] > 0 && pathFrom.length === pathTo.length) {
        pathTo[itemIndex] -= 1;
        pathTo.push(0);
      }
    }

    if (draggedItem) moveItem({ draggedItem, pathFrom, pathTo });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      // ESC key
      handleDragEnd(null, true);
    }
  };

  const handleRemoveItem = (id: string) => {
    const path = getPathById(id);

    const newItems = produce(nestableItems, (draft) => {
      const lastIndex = path.length - 1;
      const route: (number | string)[] = [];

      path.forEach((index, i) => {
        if (i === lastIndex) {
          if (path.length === 1) {
            // the path has no children
            route.push(index);
            draft.splice(index, 1);
          } else {
            route
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .reduce((accumulator: any, currentValue: any) => {
                return accumulator[currentValue];
              }, draft)
              .splice(index, 1);
          }
        } else {
          route.push(index, childrenProp);
        }
      });
    });

    setNestableItems(newItems);

    onChange(newItems);
  };

  const handleInputChange = (field: string, value: string, item: Item) => {
    const { nestableItems } = state;
    const path = getPathById(item.id);

    const newItems = produce(nestableItems, (draft) => {
      const lastIndex = path.length - 1;
      const route: (number | string)[] = [];

      path.forEach((index, i) => {
        if (i === lastIndex) {
          // When the path length is 1, it means it has no children
          route.push(index);
          if (path.length === 1) {
            draft[index][field as string] = value;
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            route.reduce((accumulator: any, currentValue: any) => {
              return accumulator[currentValue];
            }, draft)[field as string] = value;
          }
        } else {
          route.push(index, childrenProp);
        }
      });
    });

    setNestableItems(newItems);

    onChange(newItems);
  };

  const handleToggleAccordion = (item: Item) => {
    // check if this item id is in the accordionOpenItems array
    const isAccordionOpen = checkIfAccordionOpen(item);

    setAccordionOpenItems(
      !isAccordionOpen
        ? accordionOpenItems.concat(item[idProp])
        : accordionOpenItems.filter((id) => id !== item[idProp]),
    );
  };

  const stopTrackMouse = useCallback(() => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("keydown", handleKeyDown);
  }, [handleMouseMove, handleDragEnd, handleKeyDown]);

  const checkIfAccordionOpen = useCallback(
    (item: Item) => {
      return accordionOpenItems.indexOf(item[idProp]) > -1;
    },
    [accordionOpenItems],
  );

  const getItemOptions = (): NestableItemOptions => {
    return {
      draggedItem,
      idProp,
      childrenProp,
      disableDrag,
      renderListItemContent,
      checkIfAccordionOpen,
      handleDragStart,
      handleMouseEnter,
      handleToggleAccordion,
      handleRemoveItem,
      handleInputChange,
    };
  };

  const renderDragLayer = () => {
    let listStyles: CSSProperties = {};

    const draggedElem = nestableListRef.current?.querySelector(`.nestable-item-${draggedItem![idProp!]}`);

    listStyles.width = draggedElem?.clientWidth;

    if (elemCopyStyles) {
      listStyles = {
        ...listStyles,
        ...elemCopyStyles,
      };
    }

    return (
      <div className="nestable-drag-layer">
        <ol className="nestable-list" style={listStyles} ref={dragLayerRef}>
          <NestableListItem item={draggedItem!} options={getItemOptions()} isCopy />
        </ol>
      </div>
    );
  };

  // This useEffect runs whenever the items prop change.
  useEffect(() => {
    // make sure every item has property 'children'
    // if not, add one.
    setNestableItems(listWithChildren(items, childrenProp));
  }, [items]);

  // This useEffect runs whenever the mouse is moving while dragging an item (draggedItem).
  // Mouse movement is tracked in this useEffect only if draggedItem exists.
  useEffect(() => {
    if (draggedItem) {
      const diffX = mouseShiftXPosition.last.x ? mouseClientX - mouseShiftXPosition.last.x : 0;
      setMousePosition(
        produce(mouseShiftXPosition, (draft) => {
          draft.shift.x =
            (diffX >= 0 && draft.shift.x >= 0) || (diffX <= 0 && draft.shift.x <= 0)
              ? (draft.shift.x += diffX)
              : (draft.shift.x = 0);
          draft.last.x = mouseClientX;
        }),
      );
      if (Math.abs(mouseShiftXPosition.shift.x) > threshold) {
        if (mouseShiftXPosition.shift.x > 0) {
          tryIncreaseDepth(draggedItem);
        } else {
          tryDecreaseDepth(draggedItem);
        }
        setMousePosition(
          produce(mouseShiftXPosition, (draft) => {
            draft.shift.x = 0;
          }),
        );
      }
    }
  }, [draggedItem, mouseClientX, tryIncreaseDepth, tryDecreaseDepth]);

  // This useEffect runs whenever an item is dropped in a certain depth level
  useEffect(() => {
    if (isDropped) {
      onChange(nestableItems);
      setIsDropped(false);
    }
  }, [isDropped]);

  useEffect(() => {
    if (isStartDragging) {
      // Start tracking mouse events
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isStartDragging]);

  return (
    <div className={cn(`nestable nestable-${group}`, draggedItem && "is-drag-active", className)}>
      <ol className="nestable-list" ref={nestableListRef}>
        {nestableItems.map((item, i) => {
          return <NestableListItem key={item[idProp]} index={i} item={item} options={getItemOptions()} />;
        })}
      </ol>
      {draggedItem && renderDragLayer()}
    </div>
  );
};

export default Nestable;
