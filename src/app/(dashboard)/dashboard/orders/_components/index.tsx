"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { Ban, Link2Icon, Loader2, ScrollText } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import DataTable from "@/components/common/datatable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-datatable";
import { TABLE_HEADER_ORDER } from "@/tables/header-table";
import { orderStatusUpdate } from "@/controllers/order-controller";
import { IS_ACTION } from "@/constants/global-constant";
import createClientRealtime from "@/lib/supabase/realtime";
import { Badge } from "@/components/ui/badge";
import CreateOrder from "./create";
import { redirect } from "next/navigation";

export default function OrderManagement() {
  const supabase = createClientRealtime();

  // Pagination & Search
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();

  // Orders
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
        .order("created_at", { ascending: false });

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

  // Tables
  const { data: tables, refetch: refetchTables } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data } = await supabase
        .from("tables")
        .select("*")
        .order("name", { ascending: true });
      return data;
    },
  });

  // ==========================
  // Update Status
  // ==========================
  const [statusState, statusAction] = useActionState(
    orderStatusUpdate,
    IS_ACTION
  );
  const [loadingAction, setLoadingAction] = useState<null | { id: string; status: string }>(null);

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
    // reset loader
    setLoadingAction(null);
  }, [statusState, refetchOrder, refetchTables]);

  const handleUpdateStatus = ({ id, order_id, table_id, status, }: { id: string; order_id?: string|null|undefined; table_id: string; status: string;}) => {
    const formData = new FormData();
    Object.entries({ id, table_id, status }).forEach(([key, value]) => {
      formData.append(key, value);
    });

    setLoadingAction({ id, status });
    startTransition(() => {
      statusAction(formData);
    });
    if (status=="process") {
      return redirect(`/dashboard/orders/${order_id}`)
    }

  };

  // ==========================
  // Table Data
  // ==========================
  const filterData = useMemo(() => {
    return (
      orders?.data?.map((item, index) => {
        const table = item.tables as unknown as { id: string; name: string };

        return [
          currentLimit * (currentPage - 1) + index + 1,
          item.order_id,
          item.customer_name,
          table?.name || "-",
          <Badge
            className="capitalize"
            key={item.id}
            variant={
              item.status === "reserved"
                ? "warning"
                : item.status === "process"
                ? "info"
                : item.status === "canceled"
                ? "destructive"
                : item.status === "settled"
                ? "success"
                : "secondary"
            }
          >
            {item.status}
          </Badge>,
          [
            item.status === "reserved" ? (
              <div className="flex gap-2" key={item.id}>
                <Button
                  size="sm"
                  className="cursor-pointer"
                  variant="default"
                  onClick={() =>
                    handleUpdateStatus({
                      id: item.id,
                      order_id:item.order_id,
                      table_id: table?.id,
                      status: "process",
                    })
                  }
                  disabled={!!loadingAction}
                >
                  {loadingAction?.id === item.id &&
                  loadingAction?.status === "process" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Link2Icon className="h-4 w-4" /> Process
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={() =>
                    handleUpdateStatus({
                      id: item.id,
                      table_id: table?.id,
                      status: "canceled",
                    })
                  }
                  disabled={!!loadingAction}
                >
                  {loadingAction?.id === item.id &&
                  loadingAction?.status === "canceled" ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Ban className="h-4 w-4" /> Cancel
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Link key={index} href={`/dashboard/orders/${item.order_id}`}>
                <Button size="sm"
                  className="cursor-pointer" variant="outline">
                  <ScrollText className="h-4 w-4" />
                  Detail
                </Button>
              </Link>
            ),
          ],
        ];
      }) || []
    );
  }, [orders, currentLimit, currentPage, loadingAction]);

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
