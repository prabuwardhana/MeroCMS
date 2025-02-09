import React from "react";
import { NestableProps } from "./Libs/types";
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
