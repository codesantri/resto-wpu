import { DeleteModal } from "@/components/common/modals";
import { startTransition, useActionState, useEffect } from "react";
import { IS_ACTION } from "@/constants/global-constant";
import { toast } from "sonner";
import { tableDestroy } from "@/controllers/table-controller";
import { Table } from "@/validations/table-validation";

export default function DeleteTable({
  open,
  refetch,
  currentData,
  handleAction,
}: {
  open: boolean;
  refetch: () => void;
  currentData?: Table;
  handleAction: (open: boolean) => void;
}) {
  const [deleteState, deleteAction, isPendingDelete] = useActionState(
    tableDestroy,
    IS_ACTION
  );

  const onSubmit = () => {
    if (!currentData?.id) {
      toast.error("Invalid table data");
      return;
    }

    const formData = new FormData();
    formData.append("id", String(currentData.id));

    startTransition(() => {
      deleteAction(formData);
    });
  };

  useEffect(() => {
    if (!deleteState) return;

    if (deleteState.status === "error") {
      toast.error("Failed", {
        description: deleteState.errors?._form?.[0] ?? "Unknown error",
      });
    }

    if (deleteState.status === "success") {
      toast.success("Deleted!");
      handleAction(false);
      refetch();
    }
  }, [deleteState]);

  return (
    <DeleteModal
      open={open}
      onOpenChange={handleAction}
      isLoading={isPendingDelete}
      onSubmit={onSubmit}
      title="Table"
    />
  );
}
