import React, { Dispatch, SetStateAction } from "react";

import { cn } from "@/lib/utils";
import { IconListType } from "@/lib/types";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import { Check, ChevronsUpDown } from "lucide-react";

interface DropdownSelectProps {
  icons: IconListType[];
  value: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSelect: (currentValue: string, type?: IconListType) => void;
  className?: string;
}

export const DropdownSelectWithIcon = ({ icons, value, open, setOpen, onSelect, className }: DropdownSelectProps) => {
  const icon = icons.find((a) => a.name === value)!;
  const Icon = icon.icon;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          data-button-type="lang-selector"
          className={cn("justify-between hover:bg-transparent text-white", className)}
        >
          <div className="flex items-center gap-3">
            <Icon size={16} />
            <div className="text-sm">{value}</div>
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Social Icon..." />
          <CommandList>
            <CommandEmpty>Nothing is found.</CommandEmpty>
            <CommandGroup>
              {icons.map((icon) => {
                const ItemIcon = icon.icon;
                return (
                  <CommandItem
                    key={icon.name}
                    value={icon.name}
                    onSelect={(currentValue) => onSelect(currentValue, icon)}
                  >
                    <ItemIcon />
                    {icon.name}
                    <Check className={cn("ml-auto", value === icon.name ? "opacity-100" : "opacity-0")} />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
