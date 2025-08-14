import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Table } from "@/validations/table-validation";
import { orderFormValidate } from "@/validations/order-validation";
import { INITIAL_ORDER, STATE_ORDER, STATUS_ORDER } from "@/constants/order-constant";
import { orderStore } from "@/controllers/order-controller";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { RadioSelect, SelectInput, TextInput } from "@/components/common/inputs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateTableProps {
  refetch: () => void;
  tables: Table[] | undefined | null;
}

export default function CreateOrder({ refetch, tables }: CreateTableProps) {
  const form = useForm({
    resolver: zodResolver(orderFormValidate),
    defaultValues: INITIAL_ORDER,
  });

  const [createState, createAction, isPendingCreate] = useActionState(
    orderStore,
    STATE_ORDER
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
      toast.success("New order saved!");
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

  const TextStatus = ({ val }: { val: string }) => {
    return (
      <span 
        className={cn(
          "px-1 rounded-full text-white capitalize",
          {
            "bg-success": val === "available",
            "bg-warning": val === "reserved",
            "bg-danger": val === "unavailable",
          }
        )}
      >
        {val.toLowerCase()}
      </span>
    );
  };


  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Order</DialogTitle>
            <DialogDescription>
              <span>Add new order</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <TextInput
              form={form}
              label="Customer Name"
              name="customer_name"
              ph="Enter customer name"
            />


            <SelectInput
              form={form}
              label="Table Name"
              name="table_id"
              items={(tables ?? []).map((item: Table) => ({
                value: `${item.id}`,
                label: (
                  <>
                    {item.name} - {item.description} - ({item.capacity}) -{" "}
                    <TextStatus val={item.status} />
                  </>
                ),
                disabled: ['unavailable', 'reserved'].includes(item.status.toLowerCase())
              }))}
            />


            <RadioSelect
              defvalue="reserved"
              form={form}
              name="status"
              label="Status"
              options={STATUS_ORDER}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPendingCreate}>
              {isPendingCreate ? <Loader2 className="animate-spin" /> : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
