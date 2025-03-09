import React, { type ChangeEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  FaXTwitter,
  FaSquareFacebook,
  FaSquareInstagram,
  FaTiktok,
  FaLinkedin,
  FaGithub,
  FaDiscord,
} from "react-icons/fa6";

import { useNestableItemsContext } from "@/components/NestableList/providers/useNestableItemsContext";
import { DropdownSelectWithIcon } from "@/components/Dropdowns";
import Accordion from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  {
    name: "github",
    icon: FaGithub,
  },
  {
    name: "discord",
    icon: FaDiscord,
  },
];

const SocialLinkItems = () => {
  const [socialLink, setSocialLink] = useState("twitter");
  const [socialLinkUrl, setSocialLinkUrl] = useState("");
  const [open, setOpen] = useState(false);

  const { items, updateItems } = useNestableItemsContext();

  const handleSelect = (currentValue: string) => {
    setSocialLink(currentValue === socialLink ? "" : currentValue);
    setOpen(false);
  };

  return (
    <Accordion className="text-sm" title="Social Link">
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3 font-semibold mb-4">
        <div className="flex items-center">
          <Label htmlFor="NavName" className="text-primary">
            Icon
          </Label>
        </div>
        <div className="flex items-center col-span-3 md:col-span-5">
          <DropdownSelectWithIcon
            icons={socialIcons}
            value={socialLink}
            open={open}
            setOpen={setOpen}
            onSelect={handleSelect}
            className="w-full"
          />
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
