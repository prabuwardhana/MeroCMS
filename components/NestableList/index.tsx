import React from "react";
import type { NestableProps } from "./libs/types";
import { NestableProvider } from "./store/context";
import Nestable from "./NestableList";

const NestableList = (props: NestableProps) => {
  return (
    <NestableProvider>
      <Nestable {...props} />
    </NestableProvider>
  );
};

export default NestableList;
