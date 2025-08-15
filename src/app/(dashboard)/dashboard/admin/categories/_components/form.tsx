import { TextInput } from "@/components/common/inputs";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  type: "Create" | "Update";
}

export default function FormCategory<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
}: FormProps<T>) {
  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{type} Category</DialogTitle>
            <DialogDescription>
              {type === "Create"
                ? "Create new category"
                : "Update existing category details"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <TextInput
              form={form}
              label="Name"
              name={"name" as Path<T>}
              ph="Enter name"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : type}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
