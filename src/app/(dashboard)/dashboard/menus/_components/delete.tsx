import { DeleteModal } from "@/components/common/modals";
import { Profile } from "@/types/auth";
import { startTransition, useActionState, useEffect } from "react";
import { IS_ACTION } from "@/constants/global-constant";
import { toast } from "sonner";
import { menuDestroy } from "@/controllers/menu-controller";
import { Menu } from "@/validations/menu-validation";

export default function DeleteMenu({ open, refetch, currentData, handleAction, }: {
    open: boolean;
    refetch: () => void;
    currentData?: Menu;
    handleAction: (open:boolean) => void;
}) {
    const [deleteState, deleteAction, isPendingDelete] = useActionState(menuDestroy, IS_ACTION);
    const onSubmit = () => {
        const formData = new FormData();
        formData.append('id', currentData!.id as string);
        formData.append('image_url', currentData!.image_url as string);
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