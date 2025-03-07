import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Save, Trash2 } from "lucide-react";

interface LinkModalProps {
  url: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onChangeUrl: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveLink: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemoveLink: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function LinkModal(props: LinkModalProps) {
  const { url, isOpen, setIsOpen, onChangeUrl, onSaveLink, onRemoveLink } = props;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Input autoFocus value={url} onChange={onChangeUrl} />
        <div className="flex gap-2">
          <Button type="button" variant={"destructive"} onClick={onRemoveLink}>
            <Trash2 />
            Remove
          </Button>
          <Button type="button" onClick={onSaveLink}>
            <Save />
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
