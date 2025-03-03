import React, { type ChangeEvent, useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { cn } from "@/lib/utils";
import { useNestableItemsContext } from "@/components/admin/NestableList/providers/useNestableItemsContext";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Accordion from "@/components/ui/accordion";

import { FaXTwitter, FaSquareFacebook, FaSquareInstagram, FaTiktok, FaLinkedin } from "react-icons/fa6";
import { Check, ChevronsUpDown } from "lucide-react";

export const socialIcons = [
  {
    name: "twitter",
    icon: FaXTwitter,
  },
  {
    name: "facebook",
    icon: FaSquareFacebook,
  },
  {
    name: "instagram",
    icon: FaSquareInstagram,
  },
  {
    name: "tiktok",
    icon: FaTiktok,
  },
  {
    name: "linkedin",
    icon: FaLinkedin,
  },
];

const SocialLinkItems = () => {
  const [socialLink, setSocialLink] = useState("twitter");
  const [socialLinkUrl, setSocialLinkUrl] = useState("");
  const [open, setOpen] = useState(false);

  const { items, updateItems } = useNestableItemsContext();

  const socialIcon = socialIcons.find((a) => a.name === socialLink)!;
  const Icon = socialIcon.icon;

  return (
    <Accordion className="text-sm" title="Social Link">
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3 font-semibold mb-4">
        <div className="flex items-center">
          <Label htmlFor="NavName" className="text-primary">
            Icon
          </Label>
        </div>
        <div className="flex items-center col-span-3 md:col-span-5">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                data-button-type="lang-selector"
                className="justify-between hover:bg-transparent text-white w-full"
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <div className="text-sm">{socialLink}</div>
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
                    {socialIcons.map((social) => {
                      const ItemIcon = social.icon;
                      return (
                        <CommandItem
                          key={social.name}
                          value={social.name}
                          onSelect={(currentValue) => {
                            setSocialLink(currentValue === socialLink ? "" : currentValue);
                            setOpen(false);
                          }}
                        >
                          <ItemIcon />
                          {social.name}
                          <Check className={cn("ml-auto", socialLink === social.name ? "opacity-100" : "opacity-0")} />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center">
          <Label htmlFor="NavUrl" className="text-primary">
            URL
          </Label>
        </div>
        <div className="flex items-center col-span-3 md:col-span-5">
          <Input
            id="NavUrl"
            type="text"
            value={socialLinkUrl}
            className="box-border rounded-md border bg-background text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSocialLinkUrl(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col items-end">
        <Button
          size={"sm"}
          onClick={() =>
            updateItems([
              ...items,
              {
                id: `${uuidv4()}`,
                type: "social-link-item",
                name: `${socialLink}`,
                url: `${socialLinkUrl}`,
              },
            ])
          }
        >
          Add to Menu
        </Button>
      </div>
    </Accordion>
  );
};

export default SocialLinkItems;
