import React, { useState } from "react";
import { cn } from "@/src/lib/utils";

interface AccordionProps {
  open?: boolean;
  title: string;
  className?: string;
  children: React.ReactNode;
}

const Accordion = ({ open = false, title, className, children }: AccordionProps) => {
  const [accordionOpen, setAccordionOpen] = useState(open);

  const handleOnCLick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAccordionOpen(!accordionOpen);
  };

  return (
    <div>
      <button
        onClick={handleOnCLick}
        className={cn("flex justify-between items-center w-full px-4 py-2 bg-background font-semibold", className)}
      >
        <span>{title}</span>
        <svg
          className="fill-secondary-foreground shrink-0 ml-8"
          width="12"
          height="12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="5"
            width="12"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${accordionOpen && "!rotate-180"}`}
          />
          <rect
            y="5"
            width="12"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              accordionOpen && "!rotate-180"
            }`}
          />
        </svg>
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out bg-card text-card-foreground text-sm ${
          accordionOpen ? "grid-rows-[1fr] opacity-100 p-4" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden space-y-2">{children}</div>
      </div>
    </div>
  );
};

export default Accordion;
