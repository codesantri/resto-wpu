import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { INITIAL_TABLE, STATE_TABLE } from "@/constants/table-constant";
import { tableFormValidate } from "@/validations/table-validation";
import { tableStore } from "@/controllers/table-controller";

import FormTable from "./form";

interface CreateTableProps {
  refetch: () => void;
}

export default function CreateTable({ refetch }: CreateTableProps) {
  const form = useForm({
    resolver: zodResolver(tableFormValidate),
    defaultValues: INITIAL_TABLE,
  });

  const [createState, createAction, isPendingCreate] = useActionState(
    tableStore,
    STATE_TABLE
  );

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
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

      // Tutup modal kalau masih terbuka
      document
        .querySelector<HTMLElement>(
          '[data-state="open"] [data-slot="dialog-close"]'
        )
        ?.click();

      refetch();
    }
  }, [createState, form, refetch]);

  return (
    <FormTable
      form={form}
      type="Create"
      onSubmit={onSubmit}
      isLoading={isPendingCreate}
    />
  );
}
