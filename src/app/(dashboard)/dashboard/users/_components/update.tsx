import { useEffect, useState, startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormUser from "./form";
import { updateUser } from "./actions";

import { IS_UPDATE_USER } from "@/constants/user-constans";
import { Preview } from "@/types/general";
import { Profile } from "@/types/auth";
import { UpdateUserForm, updateUserSchema } from "@/validations/user-validation";
import { Dialog } from "@/components/ui/dialog";

export default function UpdateUser({
  refetch,
  currentData,
  handleChangeAction,
  open
}: {
  refetch: () => void;
  currentData?: Profile;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
  });

  const [updateState, updateAction, isPendingUpdate] = useActionState(updateUser, IS_UPDATE_USER);
  const [preview, setPreview] = useState<Preview>();

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "avatar_url") {
        if (preview?.file instanceof File && preview.file.size > 0) {
          // hanya kirim file kalau memang file baru diupload
          formData.append(key, preview.file);
        }
      } else {
        formData.append(key, value as string);
      }
    });

    formData.append("id", currentData?.id ?? "");
    formData.append("old_avatar_url", currentData?.avatar_url ?? "");
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
      form.setValue("name", currentData.name as string);
      form.setValue("role", currentData.role as string);
      form.setValue("avatar_url", currentData.avatar_url ?? "");

      setPreview({
        file: new File([], currentData.avatar_url ?? ""),
        displayUrl: currentData.avatar_url ?? "",
      });
    }
  }, [currentData, form]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormUser
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
