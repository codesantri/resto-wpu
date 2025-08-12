import { ReactNode } from "react";
import { FieldValues } from "react-hook-form";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { FormReturn, Submit } from "@/types/general";
import { Form } from "../ui/form";

interface ModalProps<T extends FieldValues> {
  children: ReactNode;
  onSubmit: Submit;
  title: string;
  description: string;
  isLoading: boolean;
  form: FormReturn<T>;
}

export default function ModalForm<T extends FieldValues>({
  children,
  title,
  description,
  isLoading,
  onSubmit,
  form,
}: ModalProps<T>) {
  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          {children}

          <DialogFooter>
            <div className="flex space-x-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => form.reset()}
                  type="button"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
