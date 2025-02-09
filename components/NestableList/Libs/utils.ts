// closest(e.target, '.field')
export const closest = (target: Element | null, selector: string) => {
  while (target) {
    if (target.matches && target.matches(selector)) return target;
    target = target.parentNode as Element;
  }
  return null;
};

export const getOffsetRect = (elem: Element) => {
  // (1)
  const box = elem.getBoundingClientRect();
  const body = document.body;
  const docElem = document.documentElement;

  // (2)
  const scrollTop = window.scrollY || docElem.scrollTop || body.scrollTop;
  const scrollLeft = window.scrollX || docElem.scrollLeft || body.scrollLeft;

  // (3)
  const clientTop = docElem.clientTop || body.clientTop || 0;
  const clientLeft = docElem.clientLeft || body.clientLeft || 0;

  // (4)
  const top = box.top + scrollTop - clientTop;
  const left = box.left + scrollLeft - clientLeft;

  return { top: Math.round(top), left: Math.round(left) };
};

export const getTotalScroll = (elem: Element) => {
  let top = 0;
  let left = 0;

  while ((elem = elem.parentNode as Element)) {
    top += elem.scrollTop || 0;
    left += elem.scrollLeft || 0;
  }

  return { top, left };
};

export const getTransformProps = (x: number, y: number) => {
  return {
    transform: `translate(${x}px, ${y}px)`,
  };
};

export const listWithChildren = <T extends Record<string, unknown>>(list: T[], childrenProp: string): T[] => {
  return list.map((item) => {
    return {
      ...item,
      [childrenProp]: item[childrenProp] ? listWithChildren(item[childrenProp] as T[], childrenProp) : [],
    };
  });
};
