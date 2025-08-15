import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import FormCategory from "./form";
import { INITIAL_CATEGORY, STATE_CATEGORY } from "@/constants/category-constant";
import { categoryFormValidate } from "@/validations/category-validation";
import { categoryStore } from "@/controllers/category-controller";

interface CreateTableProps {
  refetch: () => void;
}

export default function CreateCategory({ refetch }: CreateTableProps) {
  const form = useForm({
    resolver: zodResolver(categoryFormValidate),
    defaultValues: INITIAL_CATEGORY,
  });

  const [createState, createAction, isPendingCreate] = useActionState(categoryStore, STATE_CATEGORY);

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
      document
        .querySelector<HTMLElement>(
          '[data-state="open"] [data-slot="dialog-close"]'
        )
        ?.click();
      refetch();
    }
  }, [createState, form, refetch]);

  return (
    <FormCategory
      form={form}
      type="Create"
      onSubmit={onSubmit}
      isLoading={isPendingCreate}
    />
  );
}
