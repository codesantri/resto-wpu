import { useEffect, startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import FormTable from "./form";
import { Category, categoryFormValidate } from "@/validations/category-validation";
import { STATE_CATEGORY } from "@/constants/category-constant";
import { categoryUpdate } from "@/controllers/category-controller";

export default function UpdateCategory({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: {
  refetch: () => void;
  currentData?: Category;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm({
    resolver: zodResolver(categoryFormValidate),
  });

  const [updateState, updateAction, isPendingUpdate] = useActionState(categoryUpdate, STATE_CATEGORY);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("id", currentData?.id ?? "");

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
      form.setValue("name", currentData.name ?? "" as string);
    }
  }, [currentData, form]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormTable
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdate}
        type="Update"
      />
    </Dialog>
  );
}
