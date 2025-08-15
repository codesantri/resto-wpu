import { useEffect, useState, startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import { Dialog } from "@/components/ui/dialog";
import { Menu, menuFormValidate } from "@/validations/menu-validation";
import { STATE_MENU } from "@/constants/menu-constant";
import FormMenu from "./form";
import { menuUpdate } from "@/controllers/menu-controller";
import { Category } from "@/validations/category-validation";

interface UpdateMenuProps{
  refetch: () => void;
  currentData?: Menu;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}

export default function UpdateMenu({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: UpdateMenuProps) {
  const form = useForm({
    resolver: zodResolver(menuFormValidate),
  });

  const [updateState, updateAction, isPendingUpdate] = useActionState(menuUpdate, STATE_MENU);
  const [preview, setPreview] = useState<Preview>();

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "image_url") {
        if (preview?.file instanceof File && preview.file.size > 0) {
          formData.append(key, preview.file);
        }
      } else {
        formData.append(key, value as string);
      }
    });

    formData.append("id", currentData?.id ?? "");
    formData.append("old_image_url", currentData?.image_url ?? "");

    startTransition(() => {
      updateAction(formData);
    });
    
  });



  useEffect(() => {
    if (!updateState) return;

    if (updateState.status === "error") {
      toast.error("Failed", {
        description: updateState.errors?._form?.[0] ?? "Unknown error",
      });
    }

    if (updateState.status === "success") {
      toast.success("Data saved!");
      form.reset();
      handleChangeAction?.(false);
      refetch();
    }
  }, [updateState]);


  useEffect(() => {
    if (currentData) {
        form.setValue("name", currentData.name as string ?? "");
        form.setValue("description", currentData.description as string ?? "");
        form.setValue("price", currentData.price ?? 0);
        form.setValue("discount", currentData.discount as number ?? 0);
        form.setValue("category_id", String(currentData.category_id ?? ""));
        form.setValue("is_available", Boolean(currentData.is_available));

        // Set image_url sesuai tipe di schema
        if (typeof currentData.image_url === "string") {
            form.setValue("image_url", currentData.image_url);
            setPreview({
                file: new File([], currentData.image_url ?? ""),
                displayUrl: currentData.image_url ?? "",
            });
        } else if (currentData.image_url instanceof File) {
            form.setValue("image_url", currentData.image_url);
            setPreview({
              file: currentData.image_url,
              displayUrl: URL.createObjectURL(currentData.image_url),
            });
        }
    }
  }, [currentData, form]);

  

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormMenu
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdate}
        type="Update"
        preview={preview}
        setPreview={setPreview}
      />
    </Dialog>
  );
}
