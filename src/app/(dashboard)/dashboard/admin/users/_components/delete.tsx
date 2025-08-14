import { DeleteModal } from "@/components/common/modals";
import { startTransition, useActionState, useEffect } from "react";
import { IS_ACTION } from "@/constants/global-constant";
import { toast } from "sonner";
import { User } from "@/validations/user-validation";
import { userDestroy } from "@/controllers/user-controller";

export default function DeleteUser({ open, refetch, currentData, handleAction, }: {
    open: boolean;
    refetch: () => void;
    currentData?: User;
    handleAction: (open:boolean) => void;
}) {
    const [deleteState, deleteAction, isPendingDelete] = useActionState(userDestroy, IS_ACTION);
    const onSubmit = () => {
        const formData = new FormData();
        formData.append('id', currentData!.id as string);
        formData.append('avatar_url', currentData!.avatar_url as string);
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
      handleAction?.(false);
      refetch();
    }
  }, [deleteState]);

    return (
        <DeleteModal open={open} onOpenChange={handleAction} isLoading={isPendingDelete} onSubmit={onSubmit} title="User"/>
    )
}