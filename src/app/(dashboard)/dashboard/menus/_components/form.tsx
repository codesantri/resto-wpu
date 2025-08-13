import { FileUpload, RadioSelect, SelectInput, Switcher, TextInput } from "@/components/common/inputs";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { CATEGORIES } from "@/constants/menu-constant";
import { Preview } from "@/types/general";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
 // pastikan path sesuai

// form-user.tsx (key improvements)
interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  type: "Create" | "Update";
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}
export default function FormMenu<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  preview,
  setPreview,
}: FormProps<T>) {
  return (
      <DialogContent>
      <Form {...form}>
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <DialogHeader>
            <DialogTitle>{type} Menu</DialogTitle>
            <DialogDescription>
              {type === 'Create' ? 'Create new menu' : 'Update existing menu details'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FileUpload
              form={form}
              label="Image"
              preview={preview}
              setPreview={setPreview}
              name={'image_url' as Path<T>}
            />

            <TextInput
              form={form}
              label="Name"
              name={'name' as Path<T>}
              ph="Enter name"
            />

            <SelectInput
              form={form}
              label="Category"
              items={CATEGORIES}
               name={'category' as Path<T>}
            />

            <TextInput
              form={form}
              type="number"
              label="Price"
              name={'price' as Path<T>}
              ph="Enter Price"
            />

            <TextInput
              form={form}
              type="number"
              label="Discount"
              name={'discount' as Path<T>}
              ph="Enter Discount"
            />

            <TextInput
              form={form}
              type="textarea"
              label="Descriptions"
              name={'description' as Path<T>}
              ph="Enter descriptions"
            />

            <RadioSelect
              defvalue={type === "Create" ? true : false}
              form={form}
              name={"is_available" as Path<T>}
              label="Availability"
              options={[
                { value: "true", label: "Is Available" },
                { value: "false", label: "Unavailable" },
              ]}
            />

        
            
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="cursor-pointer" type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button className="cursor-pointer" type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : type}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
    )
}