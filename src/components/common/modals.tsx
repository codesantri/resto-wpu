import { CircleAlert, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export function DeleteModal({
  title,
  open,
  onSubmit,
  onOpenChange,
  isLoading,
}: {
  title: string;
  open: boolean;
  onSubmit: () => void;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon Warning */}
          <CircleAlert className="w-10 h-10 text-red-500" />

          {/* Title */}
          <DialogTitle className="text-lg font-semibold">
            Hapus {title}?
          </DialogTitle>

          {/* Description */}
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Data yang dihapus akan hilang
            permanen.
          </DialogDescription>
        </div>

        <DialogFooter className="sm:justify-end gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
