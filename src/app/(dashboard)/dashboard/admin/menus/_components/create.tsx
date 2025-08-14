import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import {menuFormValidate} from "@/validations/menu-validation";
import { INITIAL_MENU, STATE_MENU, } from "@/constants/menu-constant";
import FormMenu from "./form";
import { menuStore } from "@/controllers/menu-controller";



export default function CreateMenu({refetch}:{refetch:()=>void}) {
  const form = useForm({
    resolver: zodResolver(menuFormValidate),
    defaultValues: INITIAL_MENU
  });

  const [createState, createAction, isPendingCreate] = useActionState(menuStore, STATE_MENU);

  const [preview, setPreview] = useState<Preview>();

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "image_url") {
        if (preview?.file) {
          formData.append(key, preview.file);
        }
      } else {
        formData.append(key, value as string);
      }
    });

    startTransition(() => {
      createAction(formData);
    });
  });

  useEffect(() => {
    if (createState?.status === "error") {
      toast.error("Failed", {
        description: createState.errors?._form?.[0],
      });
    }

    if (createState?.status === "success") {
      toast.success("Data saved!");
      form.reset();
      setPreview(undefined);

      const closeBtn = document.querySelector(
        '[data-state="open"] [data-slot="dialog-close"]'
      ) as HTMLElement | null;
      closeBtn?.click();
      refetch();
    }
  }, [createState]);

  return (
    <FormMenu
      form={form}
      type="Create"
      onSubmit={onSubmit}
      isLoading={isPendingCreate}
      preview={preview}
      setPreview={setPreview}
    />
  );
}
