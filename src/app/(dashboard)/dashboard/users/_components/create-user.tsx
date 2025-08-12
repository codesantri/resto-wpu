import { ICREATE_USER, IS_CREATE_USER, ROLE_LIST } from "@/constants/user-constans";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Preview } from "@/types/general";
import FormUser from "./form-user";
import { CreateUserForm, createUserSchema } from "@/validations/user-validation";
import { createUser } from "./actions";

export default function CreateUser({refetch}:{refetch:()=>void}) {
  const form = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: ICREATE_USER,
  });

  const [createState, createAction, isPendingCreate] = useActionState(createUser,
    IS_CREATE_USER
  );

  const [preview, setPreview] = useState<Preview>();

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "avatar_url") {
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
    <FormUser
      form={form}
      type="Create"
      onSubmit={onSubmit}
      isLoading={isPendingCreate}
      preview={preview}
      setPreview={setPreview}
    />
  );
}
