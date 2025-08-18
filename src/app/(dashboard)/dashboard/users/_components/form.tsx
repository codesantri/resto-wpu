import { FileUpload, SelectInput, TextInput } from "@/components/common/inputs";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ROLE_LIST } from "@/constants/user-constans";
import { Preview } from "@/types/general";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
 // pastikan path sesuai

// form-user.tsx (key improvements)
interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (event:FormEvent<HTMLFormElement>)=>void;
  isLoading: boolean;
  type: "Create" | "Update";
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}

export default function FormUser<T extends FieldValues>({
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
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{type} User</DialogTitle>
            <DialogDescription>
              {type === 'Create' ? 'Create new user account' : 'Update existing user details'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {type === 'Create' && (
              <TextInput
                form={form}
                type="email"
                label="Email"
                name={'email' as Path<T>}
                ph="Enter email"
              />
            )}

            <TextInput
              form={form}
              type="text"
              label="Name"
              name={'name' as Path<T>}
              ph="Enter name"
            />

            <SelectInput
              form={form}
              label="Role"
              items={ROLE_LIST}
               name={'role' as Path<T>}
            />

            {type === 'Create' && (
              <TextInput form={form}
                type="password"
                label="Password"
                ph="Enter password"
                name={'password' as Path<T>}
              />
            )}

            <FileUpload
              form={form}
              label="Avatar"
              preview={preview}
              setPreview={setPreview}
              name={'avatar_url' as Path<T>}
            />

          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="cursor-pointer" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : type}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
    )
}