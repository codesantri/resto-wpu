"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { Ban, Link2Icon, Loader2, ScrollText } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { cn } from "@/lib/utils";
import DataTable from "@/components/common/datatable";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-datatable";
import { TABLE_HEADER_ORDER } from "@/tables/header-table";
import { Order } from "@/validations/order-validation";
import CreateOrder from "./create";
import { orderStatusUpdate } from "@/controllers/order-controller";
import { IS_ACTION } from "@/constants/global-constant";
import createClientRealtime from "@/lib/supabase/realtime";

export default function OrderManagement() {
  const supabase = createClientRealtime();

  // Pagination & Search hook
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();

  // ==========================
  // Fetch Orders
  // ==========================
  const {
    data: orders,
    isLoading,
    refetch: refetchOrder,
  } = useQuery({
    queryKey: ["orders", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      let query = supabase
        .from("orders")
        .select(
          `id, order_id, customer_name, status, payment_token, tables(name, id)`,
          { count: "exact" }
        )
        .range(
          (currentPage - 1) * currentLimit,
          currentPage * currentLimit - 1
        )
        .order("created_at", { ascending: true });

      if (currentSearch) {
        query = query.or(
          `order_id.ilike.%${currentSearch}%,customer_name.ilike.%${currentSearch}%,status.ilike.%${currentSearch}%`
        );
      }

      const { data, error, count } = await query;
      if (error) {
        toast.error("Failed to fetch orders", {
          description: error.message,
        });
        throw error;
      }
      return { data, count };
    },
  });

  // ==========================
  // Fetch Tables
  // ==========================
  const { data: tables, refetch: refetchTables } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data } = await supabase
        .from("tables")
        .select("*")
        .order("created_at", { ascending: true })
        .order("status");

      return data;
    },
  });

  // ==========================
  // Update Status
  // ==========================
  const [statusState, statusAction, isUpdateStatus] = useActionState(
    orderStatusUpdate,
    IS_ACTION
  );

  useEffect(() => {
    if (statusState?.status === "error") {
      toast.error("Failed", {
        description: statusState.errors?._form?.[0],
      });
    }
    if (statusState?.status === "success") {
      toast.success("Status Updated!");
      refetchOrder();
      refetchTables();
    }
  }, [statusState, refetchOrder, refetchTables]);

  const handleUpdateStatus = ({
    id,
    table_id,
    status,
  }: {
    id: string;
    table_id: string;
    status: string;
  }) => {
    const formData = new FormData();
    Object.entries({ id, table_id, status }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => {
      statusAction(formData);
    });
  };

  // ==========================
  // Table Data
  // ==========================
  const filterData = useMemo(() => {
    const statusActionList = [
      {
        label: (
          <span className="flex items-center gap-2">
            {isUpdateStatus ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Link2Icon /> Process
              </>
            )}
          </span>
        ),
        action: (id: string, table_id: string) =>
          handleUpdateStatus({ id, table_id, status: "process" }),
        type: "button" as const,
        variant: "default" as const,
      },
      {
        label: (
          <span className="flex items-center gap-2 text-danger">
            {isUpdateStatus ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Ban /> Cancel
              </>
            )}
          </span>
        ),
        action: (id: string, table_id: string) =>
          handleUpdateStatus({ id, table_id, status: "canceled" }),
        type: "button" as const,
        variant: "destructive" as const,
      },
    ];

    return (
      orders?.data?.map((item, index) => {
        const table = item.tables as unknown as { id: string; name: string };

        return [
          currentLimit * (currentPage - 1) + index + 1,
          item.order_id,
          item.customer_name,
          table?.name || "-",

          // Status Badge
          <span
            key={`status-${item.id}`}
            className={cn(
              "px-2 py-1 rounded-full text-white w-fit capitalize",
              {
                "bg-success": item.status === "settled",
                "bg-info": item.status === "process",
                "bg-warning": item.status === "reserved",
                "bg-danger": item.status === "canceled",
              }
            )}
          >
            {item.status}
          </span>,

          // Dropdown Action
          <DropdownAction
            key={`action-${item.id}`}
            menu={[
              ...(item.status === "reserved"
                ? statusActionList.map((row) => ({
                    label: row.label,
                    action: () => row.action(item.id, table?.id),
                    type: row.type,
                    variant: row.variant,
                  }))
                : [
                    {
                      label: (
                        <Link
                          href={`/dashboard/orders/${item.order_id}`}
                          className="flex items-center gap-2"
                        >
                          <ScrollText />
                          Detail
                        </Link>
                      ),
                      type: "link" as const,
                    },
                  ]),
            ]}
          />,
        ];
      }) || []
    );
  }, [orders, currentLimit, currentPage, isUpdateStatus, statusAction]);

  // ==========================
  // Pagination
  // ==========================
  const totalPages = useMemo(
    () => (orders?.count ? Math.ceil(orders.count / currentLimit) : 0),
    [orders?.count, currentLimit]
  );

  // ==========================
  // Realtime Listener
  // ==========================
  useEffect(() => {
    const channel = supabase
      .channel("change-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          refetchOrder();
          refetchTables();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, refetchOrder, refetchTables]);

  // ==========================
  // Render
  // ==========================
  return (
    <div className="w-full px-4 md:px-8 lg:px-12">
      {/* Header */}
      <div className="flex flex-col mb-4 gap-4 justify-between w-full lg:flex-row">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            value={currentSearch}
            onChange={(e) => handleChangeSearch(e.target.value)}
            placeholder="Search..."
            className="w-full sm:w-64"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="whitespace-nowrap">
                + Create Order
              </Button>
            </DialogTrigger>
            <CreateOrder tables={tables} />
          </Dialog>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        isLoading={isLoading}
        header={TABLE_HEADER_ORDER}
        data={filterData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />
    </div>
  );
}
