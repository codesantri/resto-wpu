import { ReactNode, useEffect } from "react";
import {DialogClose,DialogContent,DialogFooter,DialogHeader,DialogTitle} from "../ui/dialog";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { UseFormReturn, FieldValues } from "react-hook-form";

interface ModalCreateProps<T extends FieldValues> {
    children: ReactNode;
    title: string;
    submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    form: UseFormReturn<T>;
    isPending: boolean;
}

export default function ModalCreate<T extends FieldValues>({
    children,
    title,
    submit,
    form,
    isPending,
}: ModalCreateProps<T>) {
    
  return (
    <DialogContent>
      <Form {...form}>
        <form className="space-y-5" onSubmit={submit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
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
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
