import { useState } from "react";

export const useCharacterCounter = (maxLength: number) => {
  const [textLength, setTextLength] = useState(0);

  function countCharacter(count: number) {
    if (count <= maxLength) {
      setTextLength(count);
    }
  }

  return { textLength, maxLength, countCharacter };
};
