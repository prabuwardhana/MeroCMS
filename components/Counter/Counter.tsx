import React from "react";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

import { useCounterStore } from "./providers/useCounterStore";

function Counter() {
  const { count, incrementCount, decrementCount } = useCounterStore((state) => state);

  return (
    <div className="flex">
      <Button
        type="button"
        className={"inline-block rounded px-2 py-1 text-xs font-medium uppercase leading-normal"}
        onClick={() => decrementCount()}
      >
        <Minus />
      </Button>
      <div className="flex items-center text-lg px-2 py-1">{count}</div>
      <Button
        type="button"
        className={"inline-block rounded px-2 py-1 text-xs font-medium uppercase leading-normal"}
        onClick={() => incrementCount()}
      >
        <Plus />
      </Button>
    </div>
  );
}

export default Counter;
