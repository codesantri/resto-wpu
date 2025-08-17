import { useEffect, startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { Table, tableFormValidate } from "@/validations/table-validation";
import { STATE_TABLE } from "@/constants/table-constant";
import FormTable from "./form";
import { tableUpdate } from "@/controllers/table-controller";

export default function UpdateTable({
  refetch,
  currentData,
  handleChangeAction,
  open,
}: {
  refetch: () => void;
  currentData?: Table;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm({
    resolver: zodResolver(tableFormValidate),
  });

  const [updateState, updateAction, isPendingUpdate] = useActionState(
    tableUpdate,
    STATE_TABLE
  );

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
      form.setValue("description", currentData.description ?? "" as string);
      form.setValue("capacity", currentData.capacity ?? 0 as number);
      form.setValue("status", currentData.status ?? "" as string);
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
