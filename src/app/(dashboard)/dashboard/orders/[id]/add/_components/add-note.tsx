import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardPenLine } from "lucide-react";
import { useState } from "react";
import { Menu } from "@/validations/menu-validation";
import { Cart } from "@/types/order-cart";
import { Dispatch, SetStateAction } from "react";

interface AddNoteProps {
  id: string;
  notes: string;
  menuName: string;
  item: Menu;
  setCarts: Dispatch<SetStateAction<Cart[]>>;
}

export function AddNote({
  id,
  notes,
  menuName,
  item,
  setCarts,
}: AddNoteProps) {
  const [value, setValue] = useState(notes || "");

  const handleAddNote = () => {
    setCarts((prev) =>
      prev.map((cart) =>
        cart.menu_id === id ? { ...cart, notes: value } : cart
      )
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="default"
          className="cursor-pointer"
        >
          <ClipboardPenLine  size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Note for {menuName}</DialogTitle>
          <DialogDescription>
            Create a note for this order
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Add note..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <DialogFooter className="sm:justify-end mt-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={handleAddNote}
              type="button"
              variant="default"
              className="cursor-pointer"
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
